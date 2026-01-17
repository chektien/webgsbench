import { useCallback, useState } from 'react';
import type { GSFile } from '../../types';

interface FileDropzoneProps {
  onFileSelect: (gsFile: GSFile) => void;
  side?: 'A' | 'B';
}

export function FileDropzone({ onFileSelect, side }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Create unique input ID based on side to prevent conflicts
  const inputId = side ? `file-input-${side}` : 'file-input';

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.ply', '.splat', '.ksplat', '.spz'];
    const extension = file.name.substring(file.name.lastIndexOf('.'));
    return validExtensions.includes(extension);
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) {
      alert('Invalid file type. Please select a .ply, .splat, .ksplat, or .spz file.');
      return;
    }

    const extension = file.name.substring(file.name.lastIndexOf('.')) as GSFile['format'];
    const gsFile: GSFile = {
      file,
      name: file.name,
      size: file.size,
      format: extension,
    };

    setSelectedFile(file.name);
    onFileSelect(gsFile);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'scale-105'
            : ''
          }
        `}
        style={{ 
          borderColor: isDragging ? '#B39DFF' : '#555',
          backgroundColor: isDragging ? 'rgba(62, 62, 62, 0.8)' : 'rgba(62, 62, 62, 0.5)',
          fontFamily: 'Arvo, serif'
        }}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <input
          id={inputId}
          type="file"
          accept=".ply,.splat,.ksplat,.spz"
          onChange={handleFileInput}
          className="hidden"
        />
        <div>
          {selectedFile ? (
            <div>
              <p className="font-semibold text-lg" style={{ color: '#BEFF74' }}>Selected: {selectedFile}</p>
              <p className="text-sm mt-3" style={{ color: '#FFACBF' }}>Click to select a different file</p>
            </div>
          ) : (
            <div>
              <svg className="mx-auto mb-6 w-16 h-16" fill="none" stroke="#B39DFF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold mb-4" style={{ color: '#FDFDFB' }}>
                {side ? `Load file for Splat ${side}` : 'Drop a Gaussian Splat file here'}
              </p>
              <p className="text-sm mb-6" style={{ color: '#FFACBF' }}>or click to browse</p>
              <div className="inline-block px-5 py-3 rounded-lg" style={{ backgroundColor: 'rgba(68, 68, 68, 0.3)' }}>
                <p className="text-xs" style={{ color: '#FDFDFB' }}>
                  Supported: .ply, .splat, .ksplat, .spz
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
