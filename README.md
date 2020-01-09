# NEM-TYPESCRIPT

-   Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.

## npm

-   `npm test` 테스트 케이스 실행
-   `npm start` webpack으로 빌드 후 pm2로 실행
-   `npm stop` pm2로 실행한 서버 중지
-   `npm build` webpack으로 빌드
-   `npm serve` 개발 시 핫 리로드 서버

## .env

```
DB_URL=mongodb://localhost/YOUR_MONGODB_URL
SECRET_KEY=YOUR_SECRET_KEY
```

## Routers

-   POST /auth/register

```
    REQ
    BODY{
        email : "USER_EMAIL",
        password : "PASSWORD"
    }

    RES
    201 CREATE{ // 회원가입 성공
        result : true,
        data : "USER_TOKEN"
    }
```

-   POST /auth/login

```
    REQ
    BODY{
        email : "USER_EMAIL",
        password : "PASSWORD"
    }

    RES
    200 OK{ // 로그인 성공
        result : true,
        data : "USER_TOKEN"
    }
```

-   POST /auth/getProfile

```
    REQ
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 프로필 가져오기 성공
        result : true,
        data : {
            email : "USER_EMAIL",
            ...
        }
    }
```

-   POST /auth/changePassword

```
    REQ
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 비밀번호 변경 성공
        result : true,
        data : "USER_TOKEN"
    }
```

-   POST /auth/changeInformation

```
    REQ
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 정보 변경 성공
        result : true,
        message: "정보 변경 성공"
    }
```

-   POST /auth/withdrawAccount

```
    REQ
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 계정 삭제 성공
        result : true,
        message : "계정 삭제 성공"
    }
```

-   POST /post/write

```
    REQ
    BODY{
        title : "POST_TITLE",
        content : "POST_CONTENT",
        img : "BASE64_IMAGE_STRING"
    }
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 글 작성 성공
        result : true,
        data: Post,
        message : "글 작성 성공"
    }
```

-   GET /post/getMyPosts

```
    REQ
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 글 가져오기 성공
        result : true,
        data: Post[]
    }
```

-   POST /post/modification

```
    REQ
    BODY{
        _id : "POST_ID",
        title : "NEW_POST_TITLE",
        content : "NEW_POST_CONTENT",
    }
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 글 수정 성공
        result : true,
        data: Post
        message : "글 수정 성공"
    }
```

-   POST /post/delete

```
    REQ
    BODY{
        _id : "POST_ID",
    }
    HEADERS{
        Authorization : "USER_TOKEN",
    }

    RES
    200 OK{ // 글 제거 성공
        result : true,
        data: Post
        message : "글 제거 성공"
    }
```
