import Image from 'next/image';
import React from 'react';

function Banner() {
  return (
    <div className='container mx-auto flex flex-col font-roboto px-6'>
        <div className='flex items-center justify-between gap-5 my-5'>
            <div className='text-5xl font-bold flex-1'>
                <h1>Build & growth with scalable tools</h1>
            </div>
            <div className='flex flex-col gap-3 flex-1'>
                <div className='flex gap-3'>
                    <button className='px-3 py-1 border rounded-4xl hover:bg-black hover:text-white cursor-pointer'>see here</button>
                    <button className='px-3 py-1 border rounded-4xl hover:bg-black hover:text-white cursor-pointer'>see here</button>
                </div>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio assumenda alias, pariatur culpa aliquam dolorum tempora eveniet. Sit repudiandae corporis similique illum excepturi provident quisquam, esse ducimus illo dignissimos quidem.</p>
            </div>
        </div>
        <div className='w-full'>
            <Image
            src={"/banner-image.jpeg"}
            width={300}
            height={300}
            className='w-full object-cover rounded-3xl'
            />
        </div>
    </div>
  );
}

export default Banner;