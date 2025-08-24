import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileUpload: (text: string) => void;
  onFileRemove: () => void;
  uploadedText?: string;
}

const FileUpload = ({ onFileUpload, onFileRemove, uploadedText }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      onFileUpload(data.resume_text);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemoveFile = () => {
    onFileRemove();
    toast.success('Resume removed');
  };

  if (uploadedText) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-success-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Resume Uploaded</h3>
              <p className="text-sm text-gray-600">Text extracted successfully</p>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-2 text-gray-400 hover:text-error-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
          <p className="text-sm text-gray-700 leading-relaxed">
            {uploadedText.length > 500 
              ? `${uploadedText.substring(0, 500)}...` 
              : uploadedText
            }
          </p>
        </div>
        
        <button
          onClick={() => onFileRemove()}
          className="mt-4 w-full btn-secondary"
        >
          Upload Different Resume
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={isUploading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: isUploading ? Infinity : 0 }}
          className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4"
        >
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-white" />
          )}
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isUploading ? 'Uploading...' : 'Upload Resume/CV'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {isDragActive
            ? 'Drop your resume here...'
            : 'Drag and drop your resume here, or click to select file'
          }
        </p>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>PDF, DOCX, DOC</span>
          </div>
          <span>•</span>
          <span>Max 10MB</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;
