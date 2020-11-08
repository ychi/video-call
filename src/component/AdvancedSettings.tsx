import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import {ActionType} from '../state';
import {Codec, Mode} from '../state';

const AdvancedSettings = ({
    cameraList,
    micList,
    uid,
    cameraId,
    micId,
    mode,
    codec,
    dispatchUpdate
    }:{
    cameraList: MediaDeviceInfo[], 
    micList: MediaDeviceInfo[], 
    uid: string,
    cameraId: string,
    micId: string,
    mode: string, 
    codec: string,
    dispatchUpdate:(actionType: ActionType)=>(e: React.ChangeEvent<HTMLInputElement>)=>void}) => (
        <Accordion>
            <AccordionSummary 
                expandIcon={<ExpandMoreSharp/>}
                aria-controls="panel1a-content"
                id="panel1a-header">
                    <Typography>Advanced Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form noValidate autoComplete="off">
                    <TextField
                        value = {uid}
                        id = "uid"
                        onChange={dispatchUpdate(ActionType.SET_UID)}
                        label = "UID"
                        fullWidth
                        margin = "normal"/>
                    <TextField
                        select
                        id = "cameraId"
                        value = {cameraId}
                        onChange={dispatchUpdate(ActionType.SET_CAMERA)}
                        label = "Camera"
                        helperText = "Select your camera"
                        fullWidth
                        margin = "normal">
                            {cameraList.map((item, idx) => (
                                <MenuItem key={idx} value={item.deviceId}>
                                    {item.label || `Camera-${idx+1}`}
                                </MenuItem>
                            ))}
                    </TextField> 
                    <TextField
                        select
                        value = {micId}
                        onChange={dispatchUpdate(ActionType.SET_MIC)}
                        label = "Microphone"
                        helperText = "Select your microphone"
                        fullWidth
                        margin = "normal">
                            {micList.map((item, idx) => (
                                <MenuItem key={idx} value={item.deviceId}>
                                    {item.label || `Microphone-${idx+1}`}
                                </MenuItem>
                            ))}
                    </TextField>

                    <FormControl fullWidth component = "fieldset" margin="normal">
                        <FormLabel>Mode</FormLabel>
                        <RadioGroup
                            row
                            value={mode}
                            onChange={dispatchUpdate(ActionType.SET_MODE)}
                            >
                                <FormControlLabel 
                                    value={Mode.LIVE}
                                    control={<Radio color="primary"/>} 
                                    label="live" 
                                />
                                <FormControlLabel
                                    value={Mode.RTC}
                                    control={<Radio color="primary" />}
                                    label="rtc"
                                />
                            </RadioGroup>
                    </FormControl> 
                    <FormControl fullWidth component="fieldset" margin="normal">
                      <FormLabel>Codec</FormLabel>
                      <RadioGroup
                        row
                        value = {codec}
                        onChange={dispatchUpdate(ActionType.SET_CODEC)}
                      >
                        <FormControlLabel
                          value={Codec.VP8}
                          control={<Radio color="primary" />}
                          label="vp8"
                        />
                        <FormControlLabel
                          value={Codec.H264}
                          control={<Radio color="primary" />}
                          label="h264"
                        />
                      </RadioGroup>
                    </FormControl>
                </form>
            </AccordionDetails>
        </Accordion>
);

export default AdvancedSettings;