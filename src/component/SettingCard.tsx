import React, { useState } from 'react';

import {Button, Card, CardContent, CardActions, createStyles, makeStyles, Theme} from '@material-ui/core';

import { useCamera, useMicrophone } from '../hooks';
import Settings from './Settings';
import AdvancedSettings from './AdvancedSettings';

import type {Connection} from '../state';

import ActionType from '../state/actions';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        justifyContent: "center",
    }
}),
);

export default function SettingCard({
    connection,    
    doJoin,
    dispatch,
}: {
    connection: Connection,
    doJoin: ()=>void,
    dispatch: (action:{ type: ActionType, payload: any })=>void
}) {
    const classes = useStyles();
    const cameras = useCamera();
    const mics = useMicrophone();
    const {enqueueSnackbar} = useSnackbar();
    const {uid, cameraId, microphoneId, appId, channel, token, mode, codec} = connection;

    cameras.length && (!cameraId) && dispatch({
        type: ActionType.SET_CAMERA,
        payload: cameras[0].deviceId
      });
    
    mics.length && (!microphoneId) && dispatch({
      type: ActionType.SET_MIC,
      payload: mics[0].deviceId
    });

    const [appIdErr, setAppIdErr] = useState<boolean>(false);
    const [channelErr, setChannelErr] = useState<boolean>(false);
    const [tokenErr, setTokenErr] = useState<boolean>(false);

    const softValidate = () => {
      return {
        invalidAppId: (appId === ''),
        invalidChannel: (channel===''),
        invalidToken: (!token),
        };
    }

    const validate = () => {
      const {invalidAppId, invalidChannel, invalidToken} = softValidate();
      setAppIdErr(invalidAppId);
      setChannelErr(invalidChannel);
      setTokenErr(invalidToken);
      return !(invalidAppId || invalidChannel || invalidToken);
    };

    const dispatchUpdate = (actionType: ActionType) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      switch(actionType) {
        case ActionType.SET_APP_ID:
          setAppIdErr(false);
          break;
        case ActionType.SET_CHANNEL:
          setChannelErr(false);
          break;
        case ActionType.SET_TOKEN:
          setTokenErr(false);
          break;
      }  
      dispatch({
          type: actionType,
          payload: (e.target).value
        });
      }

    return (
        <Card>
        <CardContent>
          <Settings
            appId = {appId}
            channel = {channel}
            token = {token}
            appIdErr = {appIdErr}
            channelErr = {channelErr}
            tokenErr = {tokenErr}
            dispatchUpdate = {dispatchUpdate}
          />
        </CardContent>
        <CardActions className={classes.root}>
          <Button
            variant="contained"
            onClick={() => {
                if ((!cameras.length) || (!mics.length)) {
                  enqueueSnackbar(`You need camera and microphone to join channel.`, { variant: "error" });
                  return;
                }

                if (validate()) {
                  doJoin();
                }
              }
            }
            color = {Object.values(softValidate()).includes(true) || (!cameras.length) || (!mics.length) ? 'default' : 'primary'}
          >
            Join
          </Button>
        </CardActions>
        <CardContent>
          <AdvancedSettings
            cameraList = {cameras}
            micList = {mics}
            uid = {uid}
            cameraId = {cameraId}
            micId = {microphoneId}
            mode = {mode}
            codec = {codec}
            dispatchUpdate = {dispatchUpdate}
          />
        </CardContent>      
      </Card>);
}