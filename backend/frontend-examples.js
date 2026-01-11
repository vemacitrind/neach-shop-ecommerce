// Health check example
export const checkBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:3001/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Image upload example
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};

// Usage example in React component:
/*
const [backendAvailable, setBackendAvailable] = useState(false);

useEffect(() => {
  checkBackendHealth().then(setBackendAvailable);
}, []);

const handleImageUpload = async (file) => {
  try {
    const imageUrl = await uploadImage(file);
    // Save imageUrl to Supabase here
    console.log('Image uploaded:', imageUrl);
  } catch (error) {
    console.error('Upload error:', error);
  }
};
*/