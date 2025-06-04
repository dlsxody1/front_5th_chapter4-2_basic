# Core Web Vitals 기반 성능 최적화 계획

## 링크

https://front-5th-chapter4-2-basic-five.vercel.app/

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

## script 태그에 async, defer

### Head 섹션 스크립트 → async

Google Tag Manager
Cookie Consent
이유: DOM에 의존하지 않고 빨리 실행되어야 하는 외부 서비스

### Body 끝 스크립트 → defer

/js/main.js
/js/products.js
이유: DOM 조작이 필요하고 실행 순서가 중요한 페이지 핵심 기능

| 구분          | 기본 스크립트  | Async                  | Defer             |
| ------------- | -------------- | ---------------------- | ----------------- |
| **HTML 파싱** | 중단됨         | 계속 진행              | 계속 진행         |
| **다운로드**  | 동기적         | 병렬 진행              | 병렬 진행         |
| **실행 시점** | 즉시 실행      | 다운로드 완료 즉시     | HTML 파싱 완료 후 |
| **실행 순서** | 선언 순서      | 무작위 (다운로드 순서) | 선언 순서 보장    |
| **DOM 접근**  | 가능 (위험)    | 불안정                 | 안전              |
| **성능 영향** | 큰 블로킹      | 작은 블로킹            | 블로킹 없음       |
| **사용 사례** | 즉시 실행 필요 | 독립적 스크립트        | DOM 의존 스크립트 |

## font 최적화

### URL 업데이터 및 display=swap

```javascript
<!-- 기존 -->
<link href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" rel="stylesheet" />

<!-- 최적화 후 -->
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;700&display=swap" rel="stylesheet" />
```

- **기존 CSS API**: 구버전으로 비효율적인 폰트 로딩
- **CSS2 API**: Google이 2019년 출시한 최신 API
- **장점**: 더 작은 CSS 파일 크기 (20-30% 감소)
- **개선**: 최적화된 폰트 파일 제공 및 캐싱 향상

#### 문법 변경의 이유

- **기존**: `family=Heebo:300,400,600,700` (쉼표 구분)
- **신규**: `family=Heebo:wght@300;400;600;700` (세미콜론 구분)
- **효과**: 브라우저가 더 효율적으로 파싱하여 로딩 속도 향상

### 폰트 프리로드 추가

```html
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;700&display=swap"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

#### 브라우저 우선순위 조정

- **기본 로딩**: 브라우저가 폰트를 낮은 우선순위로 처리
- **preload 적용**: 폰트를 높은 우선순위 리소스로 변경
- **결과**: HTML 파싱과 동시에 폰트 다운로드 시작

#### JavaScript 비활성화 대응

- **프리로드 한계**: JavaScript 기반 로딩 방식
- **접근성 보장**: JS 비활성화 사용자도 폰트 사용 가능
- **SEO 최적화**: 검색엔진 크롤러의 안정적인 폰트 로딩

#### Progressive Enhancement 전략

- **기본 동작**: noscript로 기본 폰트 로딩 보장
- **향상된 경험**: JavaScript 활성화 시 최적화된 로딩
- **안정성**: 모든 환경에서 일관된 폰트 표시

## Before vs After

| 카테고리       | Before | After  | 개선 |
| -------------- | ------ | ------ | ---- |
| Performance    | 72% 🟠 | 93% 🟢 | +21% |
| Accessibility  | 82% 🟠 | 95% 🟢 | +13% |
| Best Practices | 75% 🟠 | 75% 🟠 | 0%   |
| SEO            | 82% 🟠 | 91% 🟢 | +9%  |
| PWA            | 0% 🔴  | 0% 🔴  | 0%   |
