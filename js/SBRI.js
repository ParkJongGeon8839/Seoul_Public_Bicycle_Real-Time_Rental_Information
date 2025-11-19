// 서울시 공공자전거 API 설정
const SERVICE_KEY = "54424853767374303130367045635767";
const API_URL = `http://openapi.seoul.go.kr:8088/${SERVICE_KEY}/json/bikeList`;

// 카카오 지도 변수
let map;
let markers = [];
let infowindow;
let currentInfowindow = null;
let allStations = []; // 전체 데이터 저장
let currentDisplayedStations = []; // 현재 표시된 대여소들

// 마커 이미지 경로 설정
const MARKER_IMAGES = {
  red: "./images/red.png",
  yellow: "./images/yellow.png",
  green: "./images/green.png",
};

// 페이지 로드 시 실행
window.onload = function () {
  initMap();
  document.getElementById("search").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchStation();
    }
  });
};

// 카카오 지도 초기화
function initMap() {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 5,
  };
  map = new kakao.maps.Map(container, options);
  infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
}

// 조회하기 버튼 클릭 시 실행
function loadData() {
  const selectedRegion = document.getElementById("region").value;

  if (!selectedRegion) {
    alert("지역을 선택해주세요.");
    return;
  }

  // 전체 데이터가 없으면 먼저 로드
  if (allStations.length === 0) {
    loadAllBikeData(selectedRegion);
  } else {
    filterAndDisplayStations(selectedRegion);
  }
}

// 대여소 검색 기능
function searchStation() {
  const searchText = document.getElementById("search").value.trim();

  if (!searchText) {
    alert("검색어를 입력해주세요.");
    return;
  }

  // 전체 데이터가 없으면 먼저 로드
  if (allStations.length === 0) {
    loadAllBikeData("전체", searchText);
  } else {
    performSearch(searchText);
  }
}

// 검색 수행
function performSearch(searchText) {
  const searchResults = allStations.filter((station) =>
    station.stationName.toLowerCase().includes(searchText.toLowerCase())
  );

  if (searchResults.length === 0) {
    alert(`"${searchText}"에 대한 검색 결과가 없습니다.`);
    return;
  }

  console.log(`검색 결과: ${searchResults.length}개`);

  displayStations(searchResults);
  updateStatistics(searchResults);

  // 첫 번째 검색 결과로 지도 이동 및 인포윈도우 표시
  if (searchResults.length > 0) {
    const firstStation = searchResults[0];
    const moveLatLng = new kakao.maps.LatLng(
      parseFloat(firstStation.stationLatitude),
      parseFloat(firstStation.stationLongitude)
    );
    map.setCenter(moveLatLng);
    map.setLevel(3);

    // 첫 번째 결과의 인포윈도우 자동 표시
    setTimeout(() => {
      const firstMarker = markers[0];
      if (firstMarker) {
        const content = createInfoWindowContent(firstStation);
        if (currentInfowindow) {
          currentInfowindow.close();
        }
        infowindow.setContent(content);
        infowindow.open(map, firstMarker);
        currentInfowindow = infowindow;
      }
    }, 300);
  }
}

// 전체 공공자전거 데이터 불러오기
async function loadAllBikeData(selectedRegion, searchText = null) {
  try {
    allStations = [];
    let startIndex = 1;
    const batchSize = 1000;
    let hasMoreData = true;

    // 로딩 표시
    document.getElementById("totalStations").textContent = "로딩중...";
    document.getElementById("totalBikes").textContent = "로딩중...";

    while (hasMoreData) {
      const endIndex = startIndex + batchSize - 1;
      const url = `${API_URL}/${startIndex}/${endIndex}/`;

      console.log(`데이터 요청: ${startIndex} ~ ${endIndex}`);

      const response = await fetch(url);
      const data = await response.json();

      if (data.rentBikeStatus && data.rentBikeStatus.row) {
        const stations = data.rentBikeStatus.row;
        allStations = allStations.concat(stations);

        // 받아온 데이터가 batchSize보다 적으면 마지막 데이터
        if (stations.length < batchSize) {
          hasMoreData = false;
        } else {
          startIndex += batchSize;
        }
      } else {
        hasMoreData = false;
      }
    }

    console.log(`총 ${allStations.length}개 대여소 데이터 로드 완료`);

    // 검색어가 있으면 검색 수행, 없으면 지역별 필터링
    if (searchText) {
      performSearch(searchText);
    } else {
      filterAndDisplayStations(selectedRegion);
    }
  } catch (error) {
    console.error("API 호출 오류:", error);
    alert("데이터를 불러오는데 실패했습니다.");
  }
}

// 지역별 필터링 및 표시
function filterAndDisplayStations(region) {
  let filteredStations;

  if (region === "전체") {
    filteredStations = allStations;
  } else {
    // stationName에서 지역명 추출하여 필터링
    filteredStations = allStations.filter((station) =>
      station.stationName.includes(region)
    );
  }

  console.log(`${region}: ${filteredStations.length}개 대여소`);

  displayStations(filteredStations);
  updateStatistics(filteredStations);

  // 첫 번째 대여소 위치로 지도 중심 이동
  if (filteredStations.length > 0) {
    const firstStation = filteredStations[0];
    const moveLatLng = new kakao.maps.LatLng(
      parseFloat(firstStation.stationLatitude),
      parseFloat(firstStation.stationLongitude)
    );
    map.setCenter(moveLatLng);
  }
}

// 대여소 통계 업데이트
function updateStatistics(stations) {
  const totalStations = stations.length;
  const totalBikes = stations.reduce(
    (sum, station) => sum + parseInt(station.parkingBikeTotCnt),
    0
  );

  document.getElementById("totalStations").textContent = totalStations;
  document.getElementById("totalBikes").textContent = totalBikes;
}

// 대여소 마커 표시
function displayStations(stations) {
  // 기존 마커 및 인포윈도우 제거
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (currentInfowindow) {
    currentInfowindow.close();
    currentInfowindow = null;
  }

  currentDisplayedStations = stations; // 현재 표시된 대여소 저장

  stations.forEach((station) => {
    const bikeCount = parseInt(station.parkingBikeTotCnt);
    const lat = parseFloat(station.stationLatitude);
    const lng = parseFloat(station.stationLongitude);

    // 자전거 대수에 따른 마커 이미지 선택
    let markerImageSrc;
    if (bikeCount === 0) {
      markerImageSrc = MARKER_IMAGES.red;
    } else if (bikeCount < 5) {
      markerImageSrc = MARKER_IMAGES.yellow;
    } else {
      markerImageSrc = MARKER_IMAGES.green;
    }

    // 마커 이미지 생성
    const imageSize = new kakao.maps.Size(40, 40);
    const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);

    // 마커 생성
    const markerPosition = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      title: station.stationName,
    });

    marker.setMap(map);
    markers.push(marker);

    // 마커 클릭 이벤트 - 인포윈도우 표시
    kakao.maps.event.addListener(marker, "click", function () {
      // 이전에 열린 인포윈도우가 있으면 닫기
      if (currentInfowindow) {
        currentInfowindow.close();
      }

      const content = createInfoWindowContent(station);
      infowindow.setContent(content);
      infowindow.open(map, marker);

      // 현재 열린 인포윈도우 저장
      currentInfowindow = infowindow;
    });
  });

  // 지도 클릭 시 인포윈도우 닫기
  kakao.maps.event.addListener(map, "click", function () {
    if (currentInfowindow) {
      currentInfowindow.close();
      currentInfowindow = null;
    }
  });
}

// 인포윈도우 내용 생성
function createInfoWindowContent(station) {
  const bikeCount = parseInt(station.parkingBikeTotCnt);
  const rackCount = parseInt(station.rackTotCnt);

  let statusClass = "available";
  let statusText = "이용가능";

  if (bikeCount === 0) {
    statusClass = "unavailable";
    statusText = "자전거 없음";
  } else if (bikeCount < 5) {
    statusClass = "warning";
    statusText = "자전거 부족";
  }

  return `
    <div class="info-window" style="padding:15px; width:280px; max-width:280px; word-break:keep-all;">
      <h3 style="margin:0 0 10px 0; font-size:14px; line-height:1.4; word-break:keep-all;">${station.stationName}</h3>
      <p style="margin:5px 0;"><strong>거치대:</strong> ${rackCount}개</p>
      <p style="margin:5px 0;"><strong>이용가능 자전거:</strong> <span class="${statusClass}">${bikeCount}대</span></p>
      <p style="margin:5px 0;"><strong>상태:</strong> <span class="${statusClass}">${statusText}</span></p>
    </div>
  `;
}
