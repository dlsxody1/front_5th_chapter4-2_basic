# Core Web Vitals 기반 성능 최적화 계획

## 애니메이션 개선

### 개선 이유

메인 스레드 블로킹: 10,000,000번 반복문이 230ms 동안 UI를 완전히 멈춤
사용자 입력 지연: 버튼 클릭, 스크롤이 즉시 반응하지 않아 사용자 경험 악화

### 개선 방법

반복문 분할: requestAnimationFrame으로 작업을 프레임별로 나누어 처리
스로틀링: 스크롤 이벤트에 디바운스 적용하여 불필요한 연산 방지
비동기 처리: 무거운 계산을 setTimeout으로 지연 실행

requestAnimationFrame 개념 설명
🎬 기본 개념
브라우저 렌더링 사이클
브라우저는 1초에 60번 (60fps) 화면을 새로 그립니다.

1프레임 = 16.67ms (1000ms ÷ 60fps)
각 프레임마다: JavaScript 실행 → 스타일 계산 → 레이아웃 → 페인트 → 컴포지트

requestAnimationFrame의 역할
"다음 프레임이 시작되기 직전에 이 함수를 실행해줘!" 라고 브라우저에게 요청하는 API

### ❌ 기존 방식의 문제점

setTimeout/setInterval 사용 시

```javascript
// 문제: 브라우저 렌더링 사이클과 맞지 않음
setTimeout(() => {
  // 이 코드가 언제 실행될지 모름
  // 렌더링 중간에 끼어들 수 있음
}, 16);

// 동기 처리 시
// 큰 문제: 메인 스레드 완전 점유
for (let i = 0; i < 10000000; i++) {
  const temp = Math.sqrt(i) * Math.sqrt(i);
}
```

### 수정된 코드

```javascript
///100,000번씩 100개 청크로 분할
//각 청크당 2-3ms → 총 처리 시간은 비슷하지만 매 프레임마다 화면 업데이트
function heavyCalculationOptimized(
  totalIterations = 10000000,
  chunkSize = 100000
) {
  return new Promise((resolve) => {
    let currentIteration = 0;

    function processChunk() {
      const endIteration = Math.min(
        currentIteration + chunkSize,
        totalIterations
      );

      for (let i = currentIteration; i < endIteration; i++) {
        const temp = Math.sqrt(i) * Math.sqrt(i);
      }

      currentIteration = endIteration;

      if (currentIteration < totalIterations) {
        // 다음 프레임에서 계속 처리 (메인 스레드 해제)
        requestAnimationFrame(processChunk);
      } else {
        console.log("복잡한 가격 계산 완료!");
        resolve("계산 완료");
      }
    }

    processChunk();
  });
}
```

## JPG -> WebP

### 개선 이유

이미지가 전체 트래픽의 60-70%를 차지하고, 그에 따라 LCP가 증가하고, SEO 패널티가 생기기 때문에 바꿨습니다.
JPEG 대비 25-30% 작은 파일 크기, 동일한 화질에서 훨씬 빠른 로딩을 할 수 있다.

### 개선 방법

/images 에 있던 .jpg 파일들을 webp 형식으로 Covert 하고 교체해줬습니다.
https://convertio.co/kr/jpg-webp/

### picture 태그의 사용

같은 코드로 모든 상황에서 최적화된 이미지를 제공하고, 각 기기에 맞는 최적 해상도 제공합니다.

```javascript
///기존
   <img class="desktop" src="images/Hero_Desktop.webp" />
      <img class="mobile" src="images/Hero_Mobile.webp" />
      <img class="tablet" src="images/Hero_Tablet.webp" />

//수정후
<source media="(min-width: 960px)" srcset="desktop.webp">  <!-- 1440px 이미지 -->
<source media="(min-width: 576px)" srcset="tablet.webp">   <!-- 768px 이미지 -->
<img src="mobile.webp" alt="Hero">                         <!-- 375px 이미지 -->

```
