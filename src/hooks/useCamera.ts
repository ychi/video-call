import { useState, useEffect } from 'react';
import AgoraRTC from '../utils/AgoraEnhancer';
import { IClientWithPromise } from 'agoran-awe/types/promisify';

const dummyClient = AgoraRTC.createClient({
    mode: 'live',
    codec: 'h264'
});



const useCamera = (client = dummyClient): MediaDeviceInfo[] => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    useEffect(() => {
        let mounted = true;
        const onChange = () => {
            if (!client) return;
            client
                .getCameras()
                .then((cameras: MediaDeviceInfo[]) => {
                    if(mounted) {
                        setCameras(cameras);
                    }
                })
                .catch(e => console.debug);
        };

        client && client.on('camera-changed', onChange);

        onChange();

        return () => {
            mounted = false;
            client && (client as IClientWithPromise & {gatewayClient: any}).gatewayClient.removeEventListener('cameraChanged', onChange);
        };
    }, [client]);

    return cameras;
};

export default useCamera;