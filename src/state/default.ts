export enum Mode {
  RTC = "rtc",
  LIVE = "live",
};

export enum Codec {
  H264 = "h264",
  VP8 = "vp8",
}

export enum SessionLiveness {
  NOT_JOINED,
  LOADING,
  JOINED,
  PUBLISHED,
};

const defaultState = {
    connection: {
      appId: "",
      channel: "",
      uid: "",
      token: null,
      cameraId: "",
      microphoneId: "",
      mode: Mode.RTC,
      codec: Codec.H264,
    },
    session: {
      liveness: SessionLiveness.NOT_JOINED,
      isAudioOnMute: false,
    }
  };



export type Connection = {
  appId: string,
  channel: string,
  uid: string,
  token: string | null,
  cameraId: string,
  microphoneId: string,
  mode: Mode,
  codec: Codec,
};

export type Session = {
  liveness: SessionLiveness,
  isAudioOnMute: boolean,
};

export type State = {
  connection: Connection,
  session: Session,
}

export default defaultState;
