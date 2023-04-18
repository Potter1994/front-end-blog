import React from "react";
const formatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function SubArticle({ subArticle }: any) {
  return (
    <>
      <div className='article-popup-dialog'>
        <div className='article-popup-dialog__item'>
          <div className='article-popup-dialog__userinfo'>
            <p className='article-popup-dialog__name'>
              {subArticle?.user?.username}
            </p>
            <p className='article-popup-dialog__date'>
              {formatter.format(new Date(subArticle.create_time || null))}
            </p>
          </div>
          <div className='article-popup-dialog__message'>{subArticle.text}</div>
        </div>
      </div>
    </>
  );
}

export default SubArticle;
