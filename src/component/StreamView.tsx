import React from 'react';
import {createStyles, Fab, Grid, makeStyles, Theme } from '@material-ui/core';
//@ts-ignore
import StreamPlayer from "agora-stream-player";
import { Session, SessionLiveness } from '../state/default';
import { CallEndSharp, Mic, MicOff, Pause, PlayArrow } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        height: "100vh",
        backgroundColor: "#4a44eb",
    },
    fabsContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    fab: {
      margin: "25px 15px",
    },
    player: {
      margin: "10px",
    }
    
}),
);

export default function StreamView({
    session,
    localStream,
    remoteStreamList,
    publish,
    unpublish,
    leave,
    muteAudio,
}: {
    session: Session,
    localStream: any,
    remoteStreamList: any[],
    publish: ()=>void,
    unpublish: ()=>void,
    join:()=>void,
    leave: ()=>void,
    muteAudio: (mute: boolean)=>void,
}) {
    const {liveness, isAudioOnMute} = session;
    const classes = useStyles();

    return (
        <Grid
          container
          justify="center"
          
          className={classes.root}
        >
          <div className={classes.fabsContainer}>
          <Fab
            className={classes.fab}
            disabled={liveness === SessionLiveness.LOADING}
            onClick={liveness === SessionLiveness.PUBLISHED ? unpublish : publish}
          >
            {liveness === SessionLiveness.PUBLISHED ? (<Pause/>): (<PlayArrow/>)}
          </Fab>
          <Fab
            className={classes.fab}
            disabled={liveness!==SessionLiveness.PUBLISHED}
            onClick={()=>muteAudio(!isAudioOnMute)}>
                  {localStream && (isAudioOnMute) ? (<Mic/>) : (<MicOff/>)}
          </Fab>
          <Fab
            className={classes.fab}
            color="secondary"
            onClick={leave}
            disabled={liveness === SessionLiveness.LOADING}>
              <CallEndSharp/>
          </Fab>
          </div>
          <Grid container justify="center">
          {localStream && (
              <StreamPlayer className={classes.player} stream={localStream} fit="contain" label="local" />
            )}
            {remoteStreamList.map((stream: any) => (
              <StreamPlayer
                className={classes.player}
                key={stream.getId()}
                stream={stream}
                fit="contain"
                label={stream.getId()}
              />
            ))}
          </Grid>
      </Grid>
    );
}