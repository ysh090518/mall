
# 📘  User API 명세서
## Base URL
```
/user
```
---
## 1. \[GET] `/register` - 회원가입 페이지

* **설명**: 회원가입 폼을 렌더링합니다.
* **세션 필요 여부**: :x: (로그인 상태일 경우 `/`로 리다이렉트)
* **응답 뷰**: `register.ejs`
* **뷰 전달 변수**:

  ```js
  {
    title: "REGISTER USER",
    user: null,
    error: null
  }
  ```

---

## 2. \[POST] `/register` - 회원가입 요청
* **설명**: 사용자 정보를 DB에 저장합니다.
* **요청 바디**:
  | 필드명      | 타입     | 필수 | 설명            |
  | -------- | ------ | -- | ------------- |
  | username | string | :white_check_mark:  | 사용자 아이디       |
  | password | string | :white_check_mark:  | 비밀번호          |
  | gender   | string | :x:  | 성별 ("M", "F") |
  | birth    | string | :x:  | 생년월일          |
* **로직**:
  * 아이디 중복 체크
  * 비밀번호 해시 (`bcrypt.hash`)
  * 사용자 저장 후 홈(`/`)으로 리다이렉트
* **에러 시**: `register.ejs`에 에러 메시지 포함 렌더링
---

## 3. \[GET] `/login` - 로그인 페이지

* **설명**: 로그인 폼을 렌더링합니다.
* **세션 필요 여부**: :x: (로그인 상태일 경우 `/`로 리다이렉트)
* **응답 뷰**: `login.ejs`
* **뷰 전달 변수**:

  ```js
  {
    title: "LOGIN",
    user: null,
    error: null
  }
  ```

---

## 4. \[POST] `/login` - 로그인 요청

* **설명**: 사용자 인증 및 세션 생성

* **요청 바디**:
    
  | 필드명      | 타입     | 필수 | 설명      |
  | -------- | ------ | -- | ------- |
  | username | string | :white_check_mark:  | 사용자 아이디 |
  | password | string | :white_check_mark:  | 비밀번호    |

* **로직**:

  * 사용자 존재 여부 확인
  * `bcrypt.compare`로 비밀번호 검증
  * 로그인 성공 시 세션에 저장:

    ```js
    req.session.user = {
      username: findUser.username,
      isAdmin: findUser.role === "admin",
      cart: []
    }
    ```

* **성공 시**: `/`로 리다이렉트

* **실패 시**: `login.ejs`에 에러 메시지 포함 렌더링

---

## 5. \[GET] `/logout` - 로그아웃 요청

* **설명**: 세션을 삭제하고 로그아웃 처리

* **세션 필요 여부**: :white_check_mark: (`isAuthentication` 미들웨어 적용)

* **로직**:

  * `req.session.destroy()`로 세션 제거
  * 성공 시 `/`로 리다이렉트
  * 실패 시 JSON 에러 반환

* **에러 응답 예시**:

  ```json
  {
    "message": "서버 에러가 발생했습니다."
  }
  ```

---

## 기타 정보

* **인증 방식**: 세션 기반 (`req.session.user`)
* **보안 처리**: `bcryptjs` 사용하여 비밀번호 해시 및 검증
* **사용 뷰 엔진**: EJS (`res.render()` 사용)
* **검증 로직**:

  * 회원가입 시 필드 누락 및 중복 체크
  * 로그인 시 존재 여부 및 비밀번호 확인

---

---

# 📘 Item API 명세서

## 📌 Base URL

```
/products
```

---

## 1. \[GET] `/` - 상품 목록 조회

* **설명**: 전체 상품 목록을 조회합니다.
* **세션 필요 여부**: ❌ (로그인 여부와 무관)
* **응답 뷰**: `products.ejs`
* **뷰 전달 변수**:

  ```js
  {
    title: "상품 목록",
    items, // 상품 리스트
    user: req.session.user
  }
  ```

---

## 2. \[GET] `/:id` - 상품 상세 조회

* **설명**: 특정 상품의 상세 정보를 조회합니다.

* **세션 필요 여부**: ❌

* **URL 파라미터**:

  | 파라미터 | 타입     | 필수 | 설명          |
  | ---- | ------ | -- | ----------- |
  | `id` | string | ✅  | 상품 ObjectId |

* **응답 뷰**: `product-detail.ejs`

* **에러 처리**: 존재하지 않을 경우 `404` 반환

* **뷰 전달 변수**:

  ```js
  {
    title: item.name,
    item,
    user: req.session.user
  }
  ```

---

## 3. \[GET] `/admin/new` - 상품 등록 폼 (관리자 전용)

* **설명**: 새로운 상품 등록 폼 페이지
* **세션 필요 여부**: ✅
* **권한 필요**: ✅ (관리자)
* **미들웨어**: `hasAdminRole`
* **응답 뷰**: `product-form.ejs`
* **뷰 전달 변수**:

  ```js
  {
    title: "상품 등록",
    item: null,
    user: req.session.user
  }
  ```

---

## 4. \[POST] `/admin/new` - 상품 등록 요청 (관리자 전용)

* **설명**: 신규 상품을 생성합니다.

* **세션 필요 여부**: ✅

* **권한 필요**: ✅ (관리자)

* **요청 바디**:

  | 필드명           | 타입     | 필수 | 설명      |
  | ------------- | ------ | -- | ------- |
  | `name`        | string | ✅  | 상품명     |
  | `price`       | number | ✅  | 가격      |
  | `image`       | string | ❌  | 이미지 URL |
  | `description` | string | ❌  | 상품 설명   |
  | `stock`       | number | ❌  | 재고 수량   |
  | `category`    | string | ❌  | 카테고리    |

* **성공 시**: `/products`로 리다이렉트

---

## 5. \[GET] `/admin/edit/:id` - 상품 수정 폼 (관리자 전용)

* **설명**: 특정 상품의 수정 폼 페이지 렌더링

* **세션 필요 여부**: ✅

* **권한 필요**: ✅ (관리자)

* **URL 파라미터**:

  | 파라미터 | 타입     | 필수 | 설명          |
  | ---- | ------ | -- | ----------- |
  | `id` | string | ✅  | 상품 ObjectId |

* **응답 뷰**: `product-form.ejs`

* **뷰 전달 변수**:

  ```js
  {
    title: "상품 수정",
    item,
    user: req.session.user
  }
  ```

* **에러 처리**: 존재하지 않을 경우 `404` 반환

---

## 6. \[POST] `/admin/edit/:id` - 상품 수정 요청 (관리자 전용)

* **설명**: 상품 정보를 수정합니다.

* **세션 필요 여부**: ✅

* **권한 필요**: ✅ (관리자)

* **URL 파라미터**:

  | 파라미터 | 타입     | 필수 | 설명          |
  | ---- | ------ | -- | ----------- |
  | `id` | string | ✅  | 상품 ObjectId |

* **요청 바디**:
  동일한 필드 구조 (`name`, `price`, `image`, `description`, `stock`, `category`)

* **성공 시**: `/products`로 리다이렉트

---

## 7. \[POST] `/admin/delete/:id` - 상품 삭제 요청 (관리자 전용)

* **설명**: 상품을 삭제합니다.

* **세션 필요 여부**: ✅

* **권한 필요**: ✅ (관리자)

* **URL 파라미터**:

  | 파라미터 | 타입     | 필수 | 설명          |
  | ---- | ------ | -- | ----------- |
  | `id` | string | ✅  | 상품 ObjectId |

* **성공 시**: `/products`로 리다이렉트

---

## ✅ 기타 사항

* **인증/권한 미들웨어**:

  * `isAuthentication`: 로그인 여부 확인
  * `hasAdminRole`: 관리자 권한 여부 확인
* **사용 뷰 엔진**: `EJS`
* **오류 처리**:

  * `findById` 실패 시 404 반환 (`상품을 찾을 수 없습니다.`)
* **라우팅 구조**: 관리자 전용 경로는 `/admin/...` 형태로 구분

---
---

# 🛒 Cart API 명세서

## 📌 Base URL

```
/cart
```

---

### 1. \[GET] `/` - 장바구니 조회

* **설명**: 로그인한 사용자의 장바구니 정보를 조회합니다.
* **인증 필요**: ✅ (`isAuthentication`)
* **동작**:

  * `User.cart`의 `item` 필드를 `populate()`로 채움
  * 장바구니 항목의 수량과 총 금액 계산
* **응답 뷰**: `cart.ejs`
* **뷰 전달 변수**:

  ```js
  {
    title: "장바구니",
    cart: [...],          // 항목 목록
    totalPrice: number,
    user: req.session.user
  }
  ```

---

### 2. \[POST] `/add` - 장바구니에 상품 추가

* **설명**: 특정 상품을 장바구니에 1개 추가하고, 재고를 1개 감소시킵니다.

* **인증 필요**: ✅

* **요청 바디**:

  | 필드명       | 타입     | 필수 | 설명          |
  | --------- | ------ | -- | ----------- |
  | productId | string | ✅  | 상품 ObjectId |

* **검증 및 처리**:

  * 상품 존재 여부 및 재고 확인
  * 장바구니에 이미 있으면 수량 증가
  * 없으면 새 항목 추가
  * 재고 감소 → 저장 후 `/cart`로 리다이렉트

---

### 3. \[POST] `/remove` - 장바구니에서 상품 제거

* **설명**: 해당 상품을 장바구니에서 제거하고, 재고를 복원합니다.

* **인증 필요**: ✅

* **요청 바디**:

  | 필드명       | 타입     | 필수 | 설명          |
  | --------- | ------ | -- | ----------- |
  | productId | string | ✅  | 상품 ObjectId |

* **처리 내용**:

  * `User.cart`에서 해당 항목 제거
  * 재고 수량 복원
  * `/cart`로 리다이렉트

---

# 🛠️ Admin API 명세서

## 📌 Base URL

```
/admin
```

> 관리자 인증 미들웨어 `hasAdminRole` 전체 적용됨

---

## 🔹 View 기반

### 1. \[GET] `/` - 관리자 대시보드

* **설명**: 관리자 홈 화면 렌더링 (모든 사용자 및 상품 목록 포함)
* **응답 뷰**: `admin.ejs`
* **뷰 전달 변수**:

  ```js
  {
    title: "WELCOME ADMIN PAGE",
    user: req.session.user,
    users: [...],
    products: [...],
    error: null
  }
  ```

---

## 🔹 RESTful 사용자 관리

### \[GET] `/users/` - 사용자 목록 조회

### \[GET] `/users/:id` - 단일 사용자 조회

### \[PATCH] `/users/:id` - 사용자 일부 정보 수정 (`birth`, `gender`)

### \[DELETE] `/users/:id` - 사용자 삭제

* **형식**: JSON API
* **응답 예시**:

  ```json
  {
    "username": "user1",
    "createdAt": "...",
    "updatedAt": "...",
    "cart": [...]
  }
  ```

---

## 🔹 API 기반 사용자 관리

### \[GET] `/api/users`

* 설명: 모든 사용자 JSON 조회

### \[GET] `/api/users/:id`

* 설명: 사용자 상세 조회

### \[PATCH] `/api/users/:id`

* 설명: 사용자 정보 전체 수정
* 바디: 사용자 전체 필드 (`username`, `gender`, `birth` 등)

### \[DELETE] `/api/users/:id`

* 설명: 사용자 삭제
* 응답: `{ message: "삭제 완료" }`

---

## 🔹 API 기반 상품 관리

### \[GET] `/api/products`

* 설명: 전체 상품 조회

### \[GET] `/api/products/:id`

* 설명: 상품 상세 조회

### \[PATCH] `/api/products/:id`

* 설명: 상품 정보 수정
* 바디: 상품 필드 (`name`, `price`, `image`, `stock`, `description`, `category` 등)

### \[DELETE] `/api/products/:id`

* 설명: 상품 삭제
* 응답: `{ message: "삭제 완료" }`

---

## ✅ 공통 처리

* **에러 처리**: 모든 API에서 `500` 상태 시 `message: "서버 오류"` 반환
* **미들웨어**:

  * `hasAdminRole`: 관리자 권한 확인
  * `isAuthentication`: 로그인 여부 확인 (장바구니)

---
