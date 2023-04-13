import React from "react";

function Footer() {
  return (
    <div className='footer'>
      <div className='footer-item'>
        <p className='footer-item__title'>Phone</p>
        <p className='footer-item__text'>0911-693-381</p>
      </div>
      <div className='footer-item'>
        <p className='footer-item__title'>Email</p>
        <a href='mailto:sky753159852@gmail.com' className='footer-item__text'>
          sky753159852@gmail.com
        </a>
      </div>
      <div className='footer-item'>
        <p className='footer-item__title'>Follow Me</p>
        <nav className='footer-media'>
          <a
            href='https://www.instagram.com/potter_pan1994/'
            className='footer-media__link'>
            <img src='/src/assets/instagram.svg' />
          </a>
          <a
            href='https://github.com/Potter1994'
            className='footer-media__link'>
            <img src='/src/assets/github.svg' />
          </a>
        </nav>
      </div>
      <div className='footer-item'>
        <p className='footer-item__text'>&copy; 2023 By Potter Pan</p>
      </div>
    </div>
  );
}

export default Footer;
