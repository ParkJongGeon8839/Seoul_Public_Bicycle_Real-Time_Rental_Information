# 🚴 서울시 공공자전거 실시간 대여정보 시스템

서울시 공공자전거(따릉이) 대여소의 실시간 정보를 지도에서 확인할 수 있는 웹 애플리케이션입니다.

## 📌 주요 기능

- 🗺️ **카카오맵 기반 지도 표시**: 서울시 전역의 공공자전거 대여소 위치를 한눈에 확인
- 🎨 **색상별 마커 표시**: 자전거 보유 대수에 따라 마커 색상 구분
  - 🔴 빨간색: 자전거 0대 (이용 불가)
  - 🟡 노란색: 자전거 1~4대 (자전거 부족)
  - 🟢 초록색: 자전거 5대 이상 (이용 가능)
- 📍 **지역별 필터링**: 서울시 25개 구별로 대여소 조회 가능
- 🔍 **대여소 검색**: 대여소 이름으로 빠른 검색
- 📊 **실시간 통계**: 전체 대여소 수 및 총 자전거 대수 표시
- ℹ️ **상세 정보**: 마커 클릭 시 거치대 수, 이용 가능 자전거 대수 등 상세 정보 확인

## 🛠️ 기술 스택

- **Frontend**: HTML, CSS, JavaScript
- **Map API**: Kakao Maps API
- **Data API**: 서울 열린데이터 광장 - 서울시 공공자전거 실시간 대여정보

## 📋 사전 준비

### 1. 서울 열린데이터 광장 API 인증키 발급

1. [서울 열린데이터 광장](https://data.seoul.go.kr/) 회원가입 및 로그인
2. [서울시 공공자전거 실시간 대여정보](https://data.seoul.go.kr/dataList/OA-15493/A/1/datasetView.do) 페이지 접속
3. "인증키 신청" 버튼 클릭하여 인증키 발급

### 2. Kakao Maps API 앱키 발급

1. [Kakao Developers](https://developers.kakao.com/) 로그인
2. "내 애플리케이션" > "애플리케이션 추가하기"
3. 앱 생성 후 "JavaScript 키" 복사

## 🚀 설치 및 실행 방법

### 1. 프로젝트 클론

```bash
git clone https://github.com/yourusername/seoul-bike-rental-info.git
cd Seoul_Public_Bicycle_Real-Time_Rental_Information
```

### 2. 프로젝트 구조

```
Seoul_Public_Bicycle_Real-Time_Rental_Information/
│
├── index.html              # 메인 HTML 파일
├── css/
│   └── SBRI.css           # 스타일시트
├── js/
│   └── SBRI.js            # JavaScript 로직
├── images/
│   ├── red.png            # 빨간색 마커 이미지
│   ├── yellow.png         # 노란색 마커 이미지
│   └── green.png          # 초록색 마커 이미지
└── README.md              # 프로젝트 설명서
```

### 3. API 키 설정

**`js/SBRI.js` 파일 수정:**

```javascript
const SERVICE_KEY = "YOUR_SEOUL_API_KEY"; // 발급받은 서울시 API 인증키 입력
```

**`index.html` 파일 수정:**

```html
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&libraries=services"
></script>
```

### 4. 마커 이미지 준비

`images/` 폴더에 다음 이미지 파일 준비:

- `red.png` (40x40 픽셀)
- `yellow.png` (40x40 픽셀)
- `green.png` (40x40 픽셀)

### 5. 실행

로컬 서버를 실행하여 프로젝트를 확인합니다:

## 📖 사용 방법

### 1. 지역별 조회

1. 상단의 "지역선택" 드롭다운에서 원하는 지역 선택
2. "조회하기" 버튼 클릭
3. 선택한 지역의 대여소가 지도에 표시됩니다

### 2. 대여소 검색

1. "대여소 검색" 입력창에 검색어 입력 (예: "역삼", "강남역")
2. "검색" 버튼 클릭 또는 Enter 키 입력
3. 검색 결과가 지도에 표시되고, 첫 번째 결과로 자동 이동합니다

### 3. 상세 정보 확인

- 마커 클릭 시 인포윈도우가 나타나며 다음 정보를 확인할 수 있습니다:
  - 대여소 이름
  - 거치대 총 개수
  - 이용 가능한 자전거 대수
  - 현재 상태 (이용가능/자전거 부족/자전거 없음)

## ⚠️ 주의사항

- API 호출 시 전체 데이터(3000개 이상)를 가져오므로 초기 로딩에 5~10초 정도 소요될 수 있습니다
- API 인증키는 공개 저장소에 업로드하지 마세요
- 카카오맵 API는 도메인 등록이 필요할 수 있습니다 (로컬 개발 시에는 localhost 허용)

## 🎯 구현된 기능

- ✅ 서울시 공공자전거 실시간 대여정보 API 연동
- ✅ 카카오 지도 API로 지도 생성 및 마커 표시
- ✅ 자전거 대수에 따른 색상별 마커 표시 (빨강/노랑/초록)
- ✅ 전체 데이터 로드 (다중 API 요청)
- ✅ 지역별 필터링 기능
- ✅ 대여소 이름 검색 기능
- ✅ 마커 클릭 시 인포윈도우 표시
