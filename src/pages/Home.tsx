import React from "react";
import { selectUser } from "../redux/reducers/userSlice";
import { useAppSelector } from "../redux/store";

function Home() {
  const userInfo = useAppSelector(selectUser).userInfo;
  const formatter = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const fakeItem = {
    username: "Andy",
    date: formatter.format(new Date()),
    title: "Title 1",
    text: "這是內容，隨便打的內容",
    articleId: 1,
  };

  let userContent = null;

  if (userInfo) {
    const { username, token } = userInfo;

    userContent = (
      <div className='article-user'>
        <p className='article-user__title'>
          User :<span className='article-user__text'>{username}</span>
        </p>
        <button className='article-user__button'>Create Article</button>
      </div>
    );
  }

  const itemTemplate = (item: any, index: number) => (
    <div key={index} className='article-item'>
      <div className='article-item-info'>
        <p className='article-item__name' title={item.username}>
          {item.username}
        </p>
        <p className='article-item__date' title={item.date}>
          {item.date}
        </p>
      </div>
      <div className='article-item-content'>
        <p className='article-item-content__title'>{item.title}</p>
        <p className='article-item-content__content'>{item.text}</p>
      </div>
    </div>
  );

  return (
    <div className='article'>
      {userContent}
      <div className='article-container'>
        {[1, 2, 3, 3, 3, 3].map((item, number) =>
          itemTemplate(fakeItem, number)
        )}
        {/* <div className='article-item'>
          <div className='article-item-info'>
            <p className='article-item__name' title='Potter'>
              Potter
            </p>
            <p className='article-item__date' title='2023/04/13 13:15'>
              2023/04/13 13:15
            </p>
          </div>
          <div className='article-item-content'>
            <p className='article-item-content__title'>Title</p>
            <p className='article-item-content__content'>text</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
