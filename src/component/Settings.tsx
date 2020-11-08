import React from 'react';
import {TextField} from '@material-ui/core';
import { ActionType } from '../state';

export default function Settings({
    appId, channel, token, dispatchUpdate,
    appIdErr, channelErr, tokenErr
}: {
    appId: string,
    channel: string,
    token: string|null,
    appIdErr: boolean,
    channelErr: boolean,
    tokenErr: boolean,
    dispatchUpdate: (actionType:ActionType)=>(e:React.ChangeEvent<HTMLInputElement>)=>void
}){
return (
        <form noValidate autoComplete="off">
            <TextField
                required
                value={appId}
                error={appIdErr}
                onChange={dispatchUpdate(ActionType.SET_APP_ID)}
                id="appId"
                label="App ID"
                fullWidth
                margin="normal"
            />
            <TextField
                required
                value={channel}
                error={channelErr}
                onChange={dispatchUpdate(ActionType.SET_CHANNEL)}
                id="channel"
                label="Channel"
                fullWidth
                margin="normal"
            />

            <TextField
                required
                value={token}
                error={tokenErr}
                onChange={dispatchUpdate(ActionType.SET_TOKEN)}
                id="token"
                label="Token"
                fullWidth
                margin="normal"
            />
        </form>);
};

