// testDb.js
import { MongoClient } from 'mongodb';

// 몽고DB 연결 주소 (본인 주소로 수정)
const connection_url = 'mongodb+srv://MungPick:mungpick123@app.kjht6xp.mongodb.net/mungpick?retryWrites=true&w=majority';

async function testDb() {
  // 1. 클라이언트 연결
  const client = await MongoClient.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('mungpick');
  const collection = db.collection('test');

  // 2. 기존 데이터 모두 삭제
  await collection.deleteMany({});

  // 3. 데이터 여러 개 추가
  await collection.insertMany([
    { name: "홍길동", age: 20 },
    { name: "이순신", age: 30 },
    { name: "강감찬", age: 40 },
  ]);

  // 4. 전체 데이터 조회
  const members = await collection.find({}).toArray();
  console.log('DB에 저장된 멤버:', members);

  // 5. 연결 종료
  await client.close();
}

testDb()
  .then(() => console.log('테스트 완료!'))
  .catch((err) => console.error('에러 발생:', err));
