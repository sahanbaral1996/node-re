import * as React from 'react';
import { uploadFaceImage } from 'services/reassessment';
import { ImageFile } from 'types/common/uploadImage';
import * as toast from 'utils/toast';

const useUploadImage = (): readonly any[] => {
  const [files, setFiles] = React.useState<ImageFile[]>([]);
  const [fileIds, setFileIds] = React.useState<string[]>([]);
  const [loading, setIsFileUploading] = React.useState<boolean>(false);

  const handleImageUploaded = async (selectedFiles: Array<ImageFile>) => {
    const formData = new FormData();

    formData.append('attachment', selectedFiles[0]);
    formData.append('prefix', 'Selfie');

    try {
      setIsFileUploading(true);
      const response = await uploadFaceImage(formData);

      const file = selectedFiles[0];

      if (response && response.data) {
        file['id'] = response.data.salesForceContentDocumentId;
        setFiles([...files, file]);
        setFileIds([...fileIds, response.data.salesForceContentDocumentId]);
      }
    } catch (error) {
      toast.error({ title: 'Error', message: 'Image upload failed.' });
    } finally {
      setIsFileUploading(false);
    }
  };

  /**
   * Invoked when delete icon is clicked.
   *
   * @param {string} filePreview
   */
  const deleteFaceImageFile = (filePreview: string) => {
    const selectedFile = files.find(file => file.preview === filePreview) || { id: '' };

    setFiles(files.filter(file => file.preview !== filePreview));

    setFileIds(fileIds.filter((id: string) => id !== selectedFile.id));
  };

  const handleResetForm = () => {
    setFileIds([]);
    setFiles([]);
    setIsFileUploading(false);
  };

  return [files, fileIds, loading, handleImageUploaded, deleteFaceImageFile, handleResetForm] as const;
};

export default useUploadImage;
