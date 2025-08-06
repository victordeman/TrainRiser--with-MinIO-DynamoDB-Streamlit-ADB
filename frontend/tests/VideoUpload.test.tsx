import { render, fireEvent, waitFor } from '@testing-library/react';
import VideoUpload from '../src/components/VideoUpload';

test('displays progress bar on valid video drop', async () => {
  const onUpload = vi.fn();
  const { getByText, getByRole } = render(<VideoUpload onUpload={onUpload} />);
  const dropZone = getByText('Drop video here (MP4, AVI, etc., max 100MB)');

  // Simulate valid video drop
  await fireEvent.drop(dropZone, {
    dataTransfer: { files: [new File([''], 'test.mp4', { type: 'video/mp4' })] }
  });

  // Wait for the progress bar to appear
  await waitFor(() => {
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  }, { timeout: 1000 });
});

test('shows error on invalid file type', async () => {
  const onUpload = vi.fn();
  const { getByText } = render(<VideoUpload onUpload={onUpload} />);
  const dropZone = getByText('Drop video here (MP4, AVI, etc., max 100MB)');

  // Mock alert
  const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

  // Simulate invalid file drop
  await fireEvent.drop(dropZone, {
    dataTransfer: { files: [new File([''], 'test.txt', { type: 'text/plain' })] }
  });

  expect(alertMock).toHaveBeenCalledWith('Invalid file type. Please upload a video.');
  alertMock.mockRestore();
});

test('shows error on file exceeding size limit', async () => {
  const onUpload = vi.fn();
  const { getByText } = render(<VideoUpload onUpload={onUpload} />);
  const dropZone = getByText('Drop video here (MP4, AVI, etc., max 100MB)');

  // Mock alert
  const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

  // Simulate large video file drop
  const largeFile = new File([''], 'large.mp4', { type: 'video/mp4' });
  Object.defineProperty(largeFile, 'size', { value: 101 * 1024 * 1024 }); // 101MB
  await fireEvent.drop(dropZone, {
    dataTransfer: { files: [largeFile] }
  });

  expect(alertMock).toHaveBeenCalledWith('File size exceeds 100MB limit');
  alertMock.mockRestore();
});
