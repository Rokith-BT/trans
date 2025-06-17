/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { Box, Button, CustomDialog, Text } from '@/atoms';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import React, { useRef, useState } from 'react';
import VideoIcon from '@/assets/icons/VideoIcon';
import StopCircle from '@/assets/icons/StopCircle';
import UploadCloud from '@/assets/icons/UploadCloud';
import AudioIcon from '@/assets/icons/AudioIcon';

interface VideoRecordingDialogProps {
  open: boolean;
  onClose: () => void;
  setValue: any;
  isVideo: boolean;
}

const VideoRecordingDialog: React.FC<VideoRecordingDialogProps> = ({ open, onClose, setValue, isVideo }) => {
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const chunks = useRef<any>([]);

  const {
    action: { fileUpload }
  } = useMasterData();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(isVideo ? { video: true, audio: true } : { audio: true });
    if (isVideo) mediaRef.current.srcObject = stream;

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: isVideo ? 'video/webm' : 'audio/webm' });
      setMediaBlob(blob);
      chunks.current = [];
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadMedia = async () => {
    if (!mediaBlob) return;

    const formData = new FormData();
    const path = isVideo ? 'donor/2001/video' : 'donor/2001/audio';
    const filename = isVideo ? 'DonorConsentVideo' : 'DonorConsentAudio';
    const file = new File([mediaBlob], isVideo ? 'recording.webm' : 'recording-audio.webm', {
      type: isVideo ? 'video/webm' : 'audio/webm'
    });

    formData.append('fileUploadRequests[0].data', file);
    formData.append('fileUploadRequests[0].path', path);
    formData.append('fileUploadRequests[0].filename', filename);
    formData.append('fileUploadRequests[0].fieldName', 'donorProfile');

    try {
      fileUpload(formData, (resp) => {
        const filepath = resp?.data?.fileResponse?.[0]?.fullfilepath;
        setValue(isVideo ? 'video' : 'audio', filepath);
        onClose();
      });
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md">
      <Box>
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4 text-center">
          {isVideo ? 'Donor Consent Video Recording' : 'Donor Consent Audio Recording'}
        </Text>

        <div className="flex flex-col items-center gap-4">
          {isVideo ? (
            <>
              <video
                ref={mediaRef}
                autoPlay
                playsInline
                muted
                className="rounded-xl border border-gray-300 shadow-sm w-full max-w-xl h-[300px] object-cover"
              />
              Note: Max Video Record is 100MB
            </>
          ) : (
            <>
              <Text className="text-sm text-gray-500">🎙️</Text>
              Note: Max Audio Record is 25MB
            </>
          )}

          <div className="flex gap-4">
            {!recording ? (
              <Button className="!bg-green-600 hover:!bg-green-700 !text-white gap-2" onClick={startRecording}>
                {isVideo ? <VideoIcon /> : <AudioIcon />}
                Start {isVideo ? 'Video' : 'Audio'} Recording
              </Button>
            ) : (
              <Button className="!bg-red-600 hover:!bg-red-700 !text-white gap-2" onClick={stopRecording}>
                <StopCircle />
                Stop Recording
              </Button>
            )}
          </div>

          {mediaBlob && (
            <>
              <Text className="text-lg font-semibold mt-4">🎬 Preview</Text>
              {isVideo ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  controls
                  src={URL.createObjectURL(mediaBlob)}
                  className="rounded-xl border border-gray-300 shadow w-full max-w-xl h-[300px] object-cover"
                />
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio
                  controls
                  src={URL.createObjectURL(mediaBlob)}
                  className="rounded-xl border border-gray-300 shadow w-full max-w-xl"
                />
              )}
              <Button className="!bg-blue-600 hover:!bg-blue-700 !text-white gap-2 mt-4" onClick={uploadMedia}>
                <UploadCloud className="w-5 h-5" />
                Upload {isVideo ? 'Video' : 'Audio'}
              </Button>
            </>
          )}
        </div>
      </Box>
    </CustomDialog>
  );
};

export default VideoRecordingDialog;
