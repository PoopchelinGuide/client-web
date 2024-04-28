import { useNavigate } from 'react-router-dom';
import {React} from 'react'
import { Result } from 'antd';


function ReviewResult() {
  const navigate = useNavigate();
  return (
    <Result
    status="404"
    title="404"
    subTitle="아직 리뷰가 존재하지 않습니다."
    extra={""}
  />
  );
}

export default ReviewResult;
