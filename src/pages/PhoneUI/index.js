import React, { useEffect, useState, useRef } from 'react';

import './App.scss';
// import assetImages from '~/assets/images';
import VideoCard from '~/components/PhoneComponents/VideoCard';
import BottomNavbar from '~/components/PhoneComponents/BottomNavbar';
import TopNavbar from '~/components/PhoneComponents/TopNavbar';

const videoUrls = [
  // {
  //   url: require('../../videos/video1.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Em quay di ta “mat nhau” 🫢🫢 #spotify #xuhuong #foryou #wrongtimes #nhachaymoingay🎧🎶🎵',
  //   song: 'Wrong Times - Puppy & Dangrangto',
  //   likes: 904,
  //   comments: 73,
  //   saves: 25,
  //   shares: 3,
  // },
  // {
  //   url: require('../../videos/video2.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Slightly warmer 💓 #fyp #xuhuong #detoiomembanggiaidieunay #kaidinh #min #greyd #nhachaymoingay',
  //   song: 'Để tôi ôm em bằng giai điệu này - Kai Đinh & MIN & GREY D',
  //   likes: 1094,
  //   comments: 163,
  //   saves: 5,
  //   shares: 17,
  // },
  // {
  //   url: require('../../videos/video3.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'A little peaceful 💓 #hoangdung #nepvaoanhvangheanhhat #amnhac #nhachay #nhacnaychillphet #nhachaymoingay #soundsofvietnam #xuhuong #longervideos',
  //   song: 'Nép vào anh và nghe anh hát - Cover - Hoàng Dũng',
  //   likes: 999,
  //   comments: 202,
  //   saves: 12,
  //   shares: 29,
  // },
  // {
  //   url: require('../../videos/video4.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Anh biết em muốn gì nèk 🤫 | #hoanhao #bray #nhacnaynghelanghien #trumnetwork #music',
  //   song: 'Hoàn Hảo - B Ray',
  //   likes: 1404,
  //   comments: 308,
  //   saves: 8,
  //   shares: 18,
  // },
  // {
  //   url: require('../../videos/video5.mp4'),
  //   profilePic: assetImages.avartar,    
  //   username: 'SunMinh🤖',
  //   description: 'Chân thành anh đã đổi được gì... | Sáng tác | #nhactamtrang #nhachaymoingay #nhacchill #music #lyrics #nhaccoloi #coversong #cover #zmattroinho #viral #fypシ #xh #tamtrang',
  //   song: 'nhạc nền - SunMinh🤖',
  //   likes: 670,
  //   comments: 73,
  //   saves: 2,
  //   shares: 11,
  // },
  // {
  //   url: require('../../videos/video6.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Anh ở vùng quê khu nghèo khó đó... #CapCut #ThienLyOi #nhachay #xuhuong #thienlyoicover',
  //   song: 'nhạc nền - T.R.I',
  //   likes: 315,
  //   comments: 1,
  //   saves: 0,
  //   shares: 0,
  // },
  // {
  //   url: require('../../videos/video7.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: '🥹🥹 #xuhuong #fyp #giaitritiktok #CapCut #uongnham',
  //   song: 'UỐNG NHẦM - Nhật Hoàng & Hennessy',
  //   likes: 350,
  //   comments: 47,
  //   saves: 1,
  //   shares: 0,
  // },
  // {
  //   url: require('../../videos/video8.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Thử đi, hay lắm, thề 🤧 #code #programming #heart #coding #foryou #romantic #developer',
  //   song: 'nhạc nền - SunMinh🤖',
  //   likes: 336,
  //   comments: 67,
  //   saves: 3,
  //   shares: 9,
  // },
  // {
  //   url: require('../../videos/video9.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Không ai đúng ai sai...🖤 #anhsad #loinoidieutrenmoiem #chill #coversong #deep',
  //   song: 'Lời nói điêu - #A N H',
  //   likes: 529,
  //   comments: 15,
  //   saves: 2,
  //   shares: 11,
  // },
  // {
  //   url: require('../../videos/video10.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: '🙆❤️ #CapCut #xuhuong #fyp',
  //   song: 'nhạc nền - SunMinh🤖',
  //   likes: 248,
  //   comments: 73,
  //   saves: 1,
  //   shares: 11,
  // },
  // {
  //   url: require('../../videos/video11.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Anh chỉ muốn... | Ronboogz #anhchimuon #ronboogz',
  //   song: 'Anh Chỉ Muốn - Ronboogz',
  //   likes: 263,
  //   comments: 1,
  //   saves: 1,
  //   shares: 1,
  // },
  // {
  //   url: require('../../videos/video12.mp4'),
  //   profilePic: assetImages.avartar,
  //   username: 'SunMinh🤖',
  //   description: 'Còn không?! | #xuhuong #phepmau #cover',
  //   song: 'Phép Màu (Đàn Cá Gỗ OST) - Mounter x MAYDAYs, Minh Tốc',
  //   likes: 348,
  //   comments: 10,
  //   saves: 0,
  //   shares: 0,
  // }
];


function App() {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const shuffledResult = videoUrls.sort(() => Math.random() - 0.5);
    setVideos(shuffledResult);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // Adjust this value to change the scroll trigger point
    };

    // This function handles the intersection of videos
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoElement = entry.target;
          videoElement.play();
        } else {
          const videoElement = entry.target;
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // We observe each video reference to trigger play/pause
    videoRefs.current.forEach((videoRef) => {
      observer.observe(videoRef);
    });

    // We disconnect the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [videos]);

  // This function handles the reference of each video
  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  return (
    <div className="app">
      <div className="container">
        <TopNavbar className="top-navbar" />
        {/* Here we map over the videos array and create VideoCard components */}
        {videos.map((video, index) => (
          <VideoCard
            key={index}
            username={video.username}
            description={video.description}
            song={video.song}
            likes={video.likes}
            saves={video.saves}
            comments={video.comments}
            shares={video.shares}
            url={video.url}
            profilePic={video.profilePic}
            setVideoRef={handleVideoRef(index)}
            autoplay={index === 0}
          />
        ))}
        <BottomNavbar className="bottom-navbar" />
      </div>
    </div>
  );
  
}

export default App;
