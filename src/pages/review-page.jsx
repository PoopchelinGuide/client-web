import React, { useEffect, useState } from 'react';
import Navigatorbar from '../components/navigatorbar';
import '../styles/review-style.css';
import { Avatar, List, Card, Tag, Rate } from 'antd';
import Header from '../components/header';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';


function ReviewPage() {
  const [reviewContent, setReviewContent] = useState([]);
  const name = '세민'; // 나중에 서버에서 화장실 정보 받을거임
  const array = [
    {
      title: '이 집 화장실 잘하네..',
      tag: ['깨끗해요', '좋아요'],
      date: '2024-04-29',
      nickname : '보땡이',
      rate : 4.5,
    },
    {
      title: '깨끗해요~',
      tag: ['별로'],
      date: '2024-04-27',
      nickname : '보땡이',
      rate : 4.5,
    },
    { title: '류세민 왔다감', date: '2024-04-30', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '잘 쓰고 가요~', date: '2024-04-21', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '오늘은 좀 더럽네요', date: '2024-04-23', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '한동근동근 왔다감', date: '2024-03-18', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '이 앱 있어서 바로', date: '2024-04-17', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '~~~~~', date: '2024-04-20', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '휴지가휴지가..ㅠㅜ', date: '2024-04-13', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '이!!', date: '2024-04-02', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '제발 맨유 결승가자!', date: '2024-04-07', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '정말 아쉬워요 ㅠ', date: '2024-04-03', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.0,},
    { title: '아이고!', date: '2024-04-19', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 3.5,},
    { title: '휴지가 없어요 ㅠㅜ', date: '2024-04-05', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
    { title: '왔다감!!!!!!', date: '2024-04-15', nickname : '보땡이', tag: ['깨끗해요', '좋아요'],rate : 4.5,},
  ];
  var sum = 0.0;
  var length = array.length;
  array.forEach(function(item, index){
    sum += item.rate;
  });
  sum = sum / length;
  useEffect(() => {
    setReviewContent(array);
  }, []);

  

  const sortedReviews = reviewContent.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });


  return (
    <div className='list-box' id='box'>
    {Header(name, sum, [])}
    <List
      itemLayout="verticalrizontal"
      dataSource={array}
      renderItem={(item, index) => (
        <List.Item>
          <Card className='data-box'>
        <Card.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={<span> <span style={{float:"left", fontSize:"0.8rem"}}>{item.nickname}</span> 
          {/* <span style={{float:"left"}}>{item.title}</span> */}
          </span>}
          description={<span style={{color:"black"}}> 
              <span>{item.title}</span>
              <Rate style={{float:"right"}} disabled allowHalf defaultValue={item.rate}/>
            </span>}/>

            <div style={{marginTop:"1rem", marginLeft:"2.4rem"}}>
        {item.tag.map((item, index) => (<Tag style={{float:"left",marginLeft:"0.2rem",}} bordered={false} color="cyan"> {item}</Tag>) )}
        <span style={{float:"right"}}>{item.date} </span>
        </div>
      </Card>
        </List.Item>
      )}
    />
    {Navigatorbar()}
    </div> 
   );
}
  
//   (
//     <div className="review-page">
//       {Header(name)}
//       {sortedReviews.map((item, index) => (
//         <div key={index} className="list-box">
//           <div className="list-box-title">
//             <p className="list-box-title-text">
//               {item.title}
//             </p>
//           </div>
//           {/* 태그 정보를 표시 */}
//           <div className="list-box-tag-date">
//             <div className="list-box-tag">
//               {item.tag &&
//                 item.tag.map((tag, idx) => {
//                   return (
//                     <Tag
//                       className="list-box-tag-button"
//                       color="blue"
//                       style={{
//                         fontSize: '0.9rem',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {tag}
//                     </Tag>
//                   );
//                 })}
//             </div>
//             <div className="list-box-date">
//               <p className="list-box-date-text">
//                 {item.date}
//               </p>
//             </div>
//           </div>
//         </div>
//       ))}
//       {Navigatorbar()}
//     </div>
//   );
// }

export default ReviewPage;
