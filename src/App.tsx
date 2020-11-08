import React, { useReducer, useState } from 'react';
import './App.css';
import { useMediaStream} from './hooks';
import { defaultState, reducer } from './state';
import ActionType from './state/actions';


import { SnackbarProvider, useSnackbar } from "notistack";

import AgoraRTC from "./utils/AgoraEnhancer";
import { IClientWithPromise } from 'agoran-awe/types/promisify';
import SettingCard from './component/SettingCard';

import StreamView from './component/StreamView';
import { SessionLiveness } from './state/default';
import GreetingView from './component/GreetingView';

function App() {
 
  const [agoraClient, setClient] = useState<IClientWithPromise|undefined>(undefined);
  const [localStream, remoteStreamList] = useMediaStream(agoraClient);
  const [state, dispatch] = useReducer(reducer, defaultState);

  const {enqueueSnackbar} = useSnackbar();


  const dispatchSessionLiveness= (liveness: SessionLiveness) => {
    dispatch({
      type: ActionType.SET_SESSION_LIVENESS,
      payload: liveness
    });
  };

  const join = async () => {
    // Creates a new agora client with given parameters.
    // mode can be 'rtc' for real time communications or 'live' for live broadcasting.
    const client = AgoraRTC.createClient({ mode: state.connection.mode, codec: state.connection.codec })
    // Loads client into the state
    setClient(client);
    dispatchSessionLiveness(SessionLiveness.LOADING);
    try {
      const uid = (isNaN(Number(state.connection.uid)) ? 0 : Number(state.connection.uid))|| Math.floor(Math.random() * 9999);
      
      // initializes the client with appId
      await client.init(state.connection.appId);

      // joins a channel with a token, channel, user id
      await client.join(state.connection.token, state.connection.channel, uid);
      
      // create a ne stream
      const stream = AgoraRTC.createStream({
        streamID: uid,
        video: true,
        audio: true,
        screen: false
      });

      // Initalize the stream
      await stream.init();

      // Publish the stream to the channel.
      await client.publish(stream);
      enqueueSnackbar(`Joined channel ${state.connection.channel}`, { variant: "info" });
      dispatchSessionLiveness(SessionLiveness.PUBLISHED);
    } catch (err) {
      enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
      dispatchSessionLiveness(SessionLiveness.NOT_JOINED);
    } 
  };


  // Only do actual publishing if currently in channel but not published
  const publish = async () => {
    if (state.session.liveness !== SessionLiveness.JOINED) return;
    try {
      if (agoraClient && localStream) {
        // Publish the stream to the channel.
        dispatchSessionLiveness(SessionLiveness.LOADING);
        await agoraClient.publish(localStream);
        enqueueSnackbar("Stream published", { variant: "info" });
        dispatchSessionLiveness(SessionLiveness.PUBLISHED);
      } 
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
      dispatchSessionLiveness(SessionLiveness.JOINED);
    } 
  };


  // Leaves the channel on invoking the function call.
  const leave = async () => {
    if (state.session.liveness === SessionLiveness.NOT_JOINED || 
      state.session.liveness === SessionLiveness.LOADING) return;
    try {
      if (agoraClient) {
        dispatchSessionLiveness(SessionLiveness.LOADING);
        // Closes the local stream. This de-allocates the resources and turns off the camera light
        localStream && localStream.close();
        // unpublish the stream from the client
        localStream && agoraClient.unpublish(localStream);
        await agoraClient.leave();
        enqueueSnackbar("Left channel", { variant: "info" });
        dispatchSessionLiveness(SessionLiveness.NOT_JOINED);
      }
    } catch (err) {
      enqueueSnackbar(`Oops, some glitches. We have logged you out. ${err}`, { variant: "error" });
      // According to common errors about `leave()`:
      //"INVALID_OPERATION", "SOCKET_ERROR", "LEAVE_MSG_TIMEOUT"
      // either indicates user has already left the channel, or the SDK
      // disconnects. So the best approach is to give user the perception 
      // that s/he has left the channel rather than stranded in limbo.
      dispatchSessionLiveness(SessionLiveness.NOT_JOINED);
    } 
  };

  const unpublish = () => {
    if (agoraClient && localStream) {
      // unpublish the stream from the client
      agoraClient.unpublish(localStream);
      dispatchSessionLiveness(SessionLiveness.JOINED);
      dispatch({
        type: ActionType.SET_AUDIO_MUTE, 
        payload: false
      });
      enqueueSnackbar("Stream unpublished", { variant: "info" });
    }
  };

  const muteAudio = (mute:boolean) => {
    if (localStream ) {
      let result:boolean;
        if (mute) {
        result = localStream.muteAudio();
        dispatch({
          type: ActionType.SET_AUDIO_MUTE,
          payload: result}); 
        result && enqueueSnackbar("You are on mute", { variant: "info" });
      } else { 
        result = localStream.unmuteAudio();
        dispatch({
          type: ActionType.SET_AUDIO_MUTE,
          payload: result});
        result && enqueueSnackbar("You are now unmuted", { variant: "info" });
      }
    }
  };


  return (
    <div className="App">
      { (state.session.liveness === SessionLiveness.NOT_JOINED) && (
        <GreetingView 
          GreetingComp={(<SettingCard
            connection = {state.connection}
            dispatch = {dispatch}
            doJoin = {join}
          />)}
      />)}

      {(state.session.liveness !== SessionLiveness.NOT_JOINED) && (
        <StreamView
          session = {state.session}
          localStream={localStream}
          remoteStreamList={remoteStreamList}
          join={join}
          leave={leave}
          publish={publish}
          unpublish={unpublish}
          muteAudio={muteAudio}/>
      )}
    </div>
  );
}

export default function AppWithNotification() { 
  return(
    <SnackbarProvider
      anchorOrigin= {{vertical: "top", horizontal: "right"}}
      autoHideDuration={2500}
      maxSnack = {5}>
        <App/>
      </SnackbarProvider>
  );
};