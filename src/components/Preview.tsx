import React from 'react';
import { Button, Dialog, Form, List } from 'antd-mobile';
import { postAnsAPI } from '../api/score';
import EachQuestion from './EachQuection';

export default function Preview(props: any) {
  const {
    data,
    ansList,
    toggleAns,
    setScore,
    setLoadStatus,
    userInfo,
    setCheck
  } = props;
  function submit() {
    let emptyPage = 0;
    for (let i = 0; i < ansList.length; i++) {
      if (ansList[i].key.length === 0) {
        emptyPage = i + 1;
        break;
      }
    }
    Dialog.confirm({
      content: (emptyPage ? '你还有小题未完成，' : '') + '确认提交试卷？',
      onConfirm: async () => {
        const paperCode = location.href
          .split('/?')[1]
          .split('&')[0]
          .split('=')[1];
        await postAnsAPI({
          id: paperCode,
          name: userInfo.name,
          uid: userInfo.uid,
          ans: ansList.map((item: any) => {
            return {
              id: item.id,
              key: item.key.map((item: any) => item * 1)
            };
          })
        }).then((res) => {
          const { data, msg } = res.data;
          if (msg === 'SUCCESS') {
            if (data === '请勿重复提交') setCheck('REPEAT');
            else {
              setCheck('SUCCESS');
              setScore(Math.floor(data));
            }
          } else {
            setCheck('ERROR');
          }
          setLoadStatus(3);
        });
      }
    });
  }
  return (
    <Form
      footer={
        <Button block type="submit" color="primary" onClick={submit}>
          提交试卷
        </Button>
      }>
      <List header="试卷总览" className="preview">
        {data.map((item: any, index: any) => (
          <EachQuestion
            item={item}
            index={index}
            toggleAns={toggleAns}
            key={index}
            field={ansList[item.index]}
          />
        ))}
      </List>
    </Form>
  );
}
