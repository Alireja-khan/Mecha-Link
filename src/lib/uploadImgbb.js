export const uploadImageToImgbb = async (imageFile) => {
 
  const formData = new FormData();
  formData.append('image', imageFile);


  const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_ImgBB_API_KEY}`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data?.data?.url;
};