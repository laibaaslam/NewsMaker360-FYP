import { useEffect, useState } from "react";
import axios from 'axios';

const Gen = () => {
  const [vlink, setvLink] = useState("");

  const handleChange = (event) => {
    setvLink(event.target.value);
  };

  const handleButtonClick = async () => {
    console.log('Button clicked, value is:', vlink);

    try {
      // const response = await axios.request({
      //   method: 'GET',
      //   url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
      //    params: {
      //     url: vlink, // Use the entered link as a parameter
      //     quality: '64'
      //   },
      //   headers: {
      //     'X-RapidAPI-Key': '5a6124a2c0msh6a7f30cab6e662fp1c2ed3jsn80cba4bb76c1',
      //     'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
      //   }
      // });

      // console.log(response.data.link);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.request({
  //         method: 'GET',
  //         url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
  //         params: {
  //           url: vlink, // Use the entered link as a parameter
  //           quality: '64'
  //         },
  //         headers: {
  //           'X-RapidAPI-Key': '5a6124a2c0msh6a7f30cab6e662fp1c2ed3jsn80cba4bb76c1',
  //           'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
  //         }
  //       });

  //       console.log(response.data.link);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [vlink]); // Include link in the dependency array to re-run the effect when link changes

  
    return (
      <div className="mt-10">
        <div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
          <button
            className="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
            type="button"
            data-ripple-light="true"
            onClick={handleButtonClick}
          >
            Invite
          </button>
          <input
            id="Link"
            type="url"
            value={vlink}
            onChange={handleChange}
            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=""
            required
          />
  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
    Email Address
  </label>
</div>
<div className="w-full pt-5 px-4 mb-8 mx-auto ">
    <div className="text-sm text-gray-700 py-1">
        Made with <a className="text-gray-700 font-semibold" href="https://www.material-tailwind.com/docs/html/input?ref=tailwindcomponents" target="_blank">Material Tailwind</a> by <a href="https://www.creative-tim.com?ref=tailwindcomponents" className="text-gray-700 font-semibold" target="_blank"> Creative Tim</a>.
    </div>
</div>

<link
  rel="stylesheet"
  href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
/>

<script src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"></script>
        </div>
     )
}

export default Gen;
























// import { useEffect, useState } from "react";
// import axios from 'axios';
// import { createWriteStream } from 'fs';
// import { join } from 'path';

// const Gen = () => {
//   const [vlink, setvLink] = useState("");
 
//   const Func= async ()=>{
//     try {
//       // const response = await axios.request({
//       //   method: 'GET',
//       //   url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
//       //   params: {
//       //     url: vlink, // Use the entered link as a parameter
//       //     quality: '64'
//       //   },
//       //   headers: {
//       //     'X-RapidAPI-Key': '5a6124a2c0msh6a7f30cab6e662fp1c2ed3jsn80cba4bb76c1',
//       //     'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
//       //   }
//       // });

//       // console.log(response.data.link);
//       //////DOWNLOAD AUDIO 
//       const audioDownloadLink = 'https://ytmp3.savevids.net/dl?hash=9gI5ZKx6nTLniGhbdmjx1L5f9tjdho9pIDl4c5QhkvzHdGQunlbByPCZIH2ep5rwwkSSTc3YLy6sjKJyzCbRTfETD0VEo7eDqaSgtOy55k08gtwyAfgjN4dghhEUv4d98GCcfCXd%2B2cVcixrJ7DL%2BJ8utial7HSbOf7IiWx48KXclU%2Bo3FuO7y5%2FMdEyv%2BojE%2FgDDjjXzMd02xP%2FHuY3jddlojN0sgF50zkjZhFaO7p7kB%2FVKqCWbJkXLiMVa%2FQg';

//       const audioResponse = await axios({
//         method: 'get',
//         url: audioDownloadLink,
//         responseType: 'stream',
//       });
// //        // Specify the local path where you want to save the audio file
// //     const localFilePath = path.join('C:\Users\IAT\fyp', 'audio.mp3');

// //     // Pipe the response stream to the file system
// //     audioResponse.data.pipe(fs.createWriteStream(localFilePath));

// // console.log('Audio downloaded and saved at:', localFilePath);

//     } catch (error) {
//       console.error(error);
//     }
//   };
   
//   const handleChange = (event) => {
//     setvLink(event.target.value);
//   };

//   const handleButtonClick = async () => {
//     console.log('Button clicked, value is:', vlink);
//     Func();
//   };

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await axios.request({
//   //         method: 'GET',
//   //         url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
//   //         params: {
//   //           url: vlink, // Use the entered link as a parameter
//   //           quality: '64'
//   //         },
//   //         headers: {
//   //           'X-RapidAPI-Key': '5a6124a2c0msh6a7f30cab6e662fp1c2ed3jsn80cba4bb76c1',
//   //           'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
//   //         }
//   //       });

//   //       console.log(response.data.link);

//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [vlink]); // Include link in the dependency array to re-run the effect when link changes
  
//     return (
//       <div className="mt-10">
//         <div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
//           <button
//             className="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
//             type="button"
//             data-ripple-light="true"
//             onClick={handleButtonClick}
//           >
//             Invite
//           </button>
//           <input
//             id="Link"
//             type="url"
//             value={vlink}
//             onChange={handleChange}
//             className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
//             placeholder=""
//             required
//           />
//   <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
//     Email Address
//   </label>
// </div>
// <div className="w-full pt-5 px-4 mb-8 mx-auto ">
//     <div className="text-sm text-gray-700 py-1">
//         Made with <a className="text-gray-700 font-semibold" href="https://www.material-tailwind.com/docs/html/input?ref=tailwindcomponents" target="_blank">Material Tailwind</a> by <a href="https://www.creative-tim.com?ref=tailwindcomponents" className="text-gray-700 font-semibold" target="_blank"> Creative Tim</a>.
//     </div>
// </div>

// <link
//   rel="stylesheet"
//   href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
// />

// <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"></script>
//         </div>
//      )
// }

// export default Gen;


// /**

// const youtubeVideoUrl = 'https://www.youtube.com/watch?v=your_video_id';
// const rapidApiKey = 'YOUR_RAPIDAPI_KEY';

// async function downloadAudio(videoUrl, apiKey) {
//   try {
//     const response = await axios.request({
//         method: 'GET',
//         url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
//          params: {
//           url: vlink, // Use the entered link as a parameter
//           quality: '64'
//         },
//         headers: {
//           'X-RapidAPI-Key': '5a6124a2c0msh6a7f30cab6e662fp1c2ed3jsn80cba4bb76c1',
//           'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
//         }
//       });
//      // console.log(response.data.link);

//    //////////////////////// Assuming the API responds with a download link
//     const audioDownloadLink = response.data.link;

//     // Use the audioDownloadLink to download the audio file
//     const audioResponse = await axios({
//       method: 'get',
//       url: audioDownloadLink,
//       responseType: 'stream',
//     });

//     // Specify the local path where you want to save the audio file
//     const localFilePath = path.join(C:\Users\IAT\fyp, 'audio.mp3');

//     // Pipe the response stream to the file system
//     audioResponse.data.pipe(fs.createWriteStream(localFilePath));

//     console.log('Audio downloaded and saved at:', localFilePath);
//   } catch (error) {
//     console.error('Error downloading audio:', error.message);
//   }
// }

// // Example usage
// downloadAudio(youtubeVideoUrl, rapidApiKey);
//  */