'use strict';

import pageNavigation from './modules/pageNavigation';
import headerFon from '../components/header/headerFon';
import Header from './../components/header/Header';
// import CounterAnimationCollection from '../components/CounterAnimation/CounterAnimation';
import spollers from '../components/spollers/spollers';
import ScrollUpButton from '../components/scrollUpButton/ScrollUpButton';
// import CountdownTimer from '../components/timer/CountdownTimer';
// import VideoLazy from '../components/video/video-lazy/VideoLazy';
// import Popup from '../components/Popup/Popup';
// import VideoPlayerCollection from './../components/video/video-player/VideoPlayer';
// import scroller from '../components/scroller/scroller';
// import LoginCard from '../components/loginCard/LoginCard';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  headerFon();
  new Header();
  // new CounterAnimationCollection();
  spollers();
  new ScrollUpButton();
  // scroller();
  // new CountdownTimer('.countdown', 86440, 'Time is up!');
  // new VideoLazy(
  //   'https://www.youtube.com/embed/J1d4nCXNlDs?si=FwqnJhoHvI-mTHg6',
  //   {
  //     container: document.getElementById('video-1'),
  //   },
  // );
  // new Popup();
  // new VideoPlayerCollection();
  // new LoginCard();
});
