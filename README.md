# NEM-TYPESCRIPT
- Node.js + Express + MongoDB + Typescript 를 사용하여 서버 탬플릿을 제작했습니다.
## Routers
- /auth/register
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
- /auth/login
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
- /auth/getProfile
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
- /auth/changePassword
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
- /auth/withdrawAccount
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