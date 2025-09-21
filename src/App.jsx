import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {useReducer, useRef, createContext, useEffect, useState} from "react";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";
import DiaryItem from './components/DiaryItem';

const mockData = [
  {
    id: 1,
    createdDate: new Date("2025-09-20").getTime(),
    emotionId: 1,
    content: "기분 왕왕좋음 우끽끼"

  },
  {
    id: 2,
    createdDate: new Date("2025-09-18").getTime(),
    emotionId: 4,
    content: "흐음... 그냥 그랬음"

  },
  {
    id: 3,
    createdDate: new Date("2025-03-02").getTime(),
    emotionId: 2,
    content: "내 생일!! ㅎㅎ"

  },
  {
    id: 4,
    createdDate: new Date("2025-09-13").getTime(),
    emotionId: 5,
    content: "기분 나쁘아아아아아아아 ㅠ-ㅠ "
  },
  {
    id: 5,
    createdDate: new Date("2025-09-01").getTime(),
    emotionId: 2,
    content: "퀸의 9월 시작!"
  },
  {
    id: 6,
    createdDate: new Date("2025-09-21").getTime(),
    emotionId: 3,
    content: "한입리액트 감정일기장 프로젝트 끝!!"
  }
]

function reducer(state, action) {
  let nextState; 

  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE": { 
      nextState = [action.data, ...state];
      break;
    }

    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id)
        ? action.data 
        : item
    );
    break;
  }

    case "DELETE": {
      nextState = state.filter(
        (item) => String(item.id) !== String(action.id)
      );
      break;
    }

    default: 
    return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

const DiaryStateContext = createContext();
const DiaryDispatchContext = createContext();
export {DiaryStateContext, DiaryDispatchContext};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(3);

  useEffect(()=>{
    const storedData = localStorage.getItem("diary");
    if(!storedData) {
      setIsLoading(false);
      return;
    }

    const parsedData = JSON.parse(storedData);
    if(!Array.isArray(parsedData)) {
      return;
    }
    
    let maxId = 0;
    parsedData.forEach((item)=> {
      if(Number(item.id) > maxId){
        maxId = Number(item.id)
      }
    })

    idRef.current = maxId + 1;

    dispatch({
      type: "INIT",
      data: parsedData,
    })
    setIsLoading(false);
  }, [])

  //localStorage.setItem('test', 'hello');
  //localStorage.setItem("person", JSON.stringify({name: "김규리"}));

  //localStorage.getItem("test");
  //JSON.parse(localStorage.getItem("person"));

  //localStorage.removeItem("test");

  //새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      }
    })
  }

  //기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      }
    })
  }

  //기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    })
  }

  if(isLoading) {
    return <div>데이터 로딩중입니다...</div>
  }

  return (
    <>
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider
      value={{
        onCreate, 
        onUpdate,
        onDelete,
      }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/diary/:id" element={<Diary />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
    </>
  );
}

export default App;