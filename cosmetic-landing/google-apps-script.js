/**
 * REDMEDICOS 상담 신청 폼 데이터를 구글 시트에 저장하는 Apps Script
 *
 * 설정 방법:
 * 1. Google Sheets에서 '확장 프로그램' > 'Apps Script' 클릭
 * 2. 이 코드를 붙여넣기
 * 3. '배포' > '새 배포' 클릭
 * 4. 유형: '웹 앱' 선택
 * 5. 실행 주체: '나' 선택
 * 6. 액세스 권한: '모든 사용자' 선택
 * 7. 배포 후 웹 앱 URL 복사하여 Next.js 앱에서 사용
 */

// 스프레드시트 ID
const SPREADSHEET_ID = '1fmUY5sM1932dTb3WKiaosadR59xKOdl4X6ZmOnDKy1M';

// 시트 이름 (필요시 변경)
const SHEET_NAME = '상담신청';

/**
 * GET 요청 처리 (테스트용)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success', message: 'REDMEDICOS API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 전화번호를 010-XXXX-XXXX 형식으로 변환
 */
function formatPhoneNumber(phone) {
  if (!phone) return '';

  // 숫자만 추출
  const digits = phone.replace(/\D/g, '');

  // 10자리 또는 11자리 전화번호 처리
  if (digits.length === 10) {
    // 10자리: 01X-XXX-XXXX 형식
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 11) {
    // 11자리: 010-XXXX-XXXX 형식
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // 그 외의 경우 원본 반환
  return phone;
}

/**
 * 카테고리 영문을 한국어로 변환
 */
function translateCategories(categories) {
  if (!categories) return '';

  const categoryMap = {
    'skincare': '스킨케어',
    'makeup': '메이크업',
    'cleansing': '클렌징',
    'suncare': '선케어',
    'bodycare': '바디케어',
    'haircare': '헤어케어'
  };

  // 카테고리 문자열을 분리하고 한국어로 변환
  const categoryList = categories.split(',').map(cat => {
    const trimmed = cat.trim().toLowerCase();
    return categoryMap[trimmed] || trimmed;
  });

  return categoryList.join(', ');
}

/**
 * POST 요청 처리 - 폼 데이터 저장
 */
function doPost(e) {
  try {
    // CORS 헤더 설정
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // 헤더 행 추가
      const headers = [
        '접수일시',
        '이름/회사명',
        '연락처',
        '이메일',
        '관심 카테고리',
        '예상 주문수량',
        '문의내용',
        '개인정보동의'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // 헤더 스타일링
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#dc2626'); // REDMEDICOS 레드
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // 현재 시간 (한국 시간)
    const now = new Date();
    const koreaTime = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    // e.parameter에서 직접 데이터 가져오기 (URL 인코딩된 form data)
    const name = e.parameter.name || '';
    const phone = formatPhoneNumber(e.parameter.phone || '');
    const email = e.parameter.email || '';
    const categories = translateCategories(e.parameter.categories || '');
    const quantity = e.parameter.quantity || '';
    const message = e.parameter.message || '';
    const privacy = e.parameter.privacy || 'N';

    // 데이터 행 추가
    const rowData = [
      koreaTime,
      name,
      phone,
      email,
      categories,
      quantity,
      message,
      privacy
    ];

    sheet.appendRow(rowData);

    // 성공 응답
    return output.setContent(JSON.stringify({
      status: 'success',
      message: '상담 신청이 접수되었습니다.',
      timestamp: koreaTime
    }));

  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 테스트 함수 - Apps Script 에디터에서 실행하여 테스트
 */
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: '테스트 사용자',
        phone: '010-1234-5678',
        email: 'test@example.com',
        categories: ['skincare', 'makeup'],
        quantity: '100-500',
        message: '테스트 문의입니다.',
        privacy: true
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}

/**
 * 시트 초기화 함수 (필요시 수동 실행)
 */
function initializeSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (sheet) {
    // 기존 시트 삭제
    spreadsheet.deleteSheet(sheet);
  }

  // 새 시트 생성
  sheet = spreadsheet.insertSheet(SHEET_NAME);

  // 헤더 설정
  const headers = [
    '접수일시',
    '이름/회사명',
    '연락처',
    '이메일',
    '관심 카테고리',
    '예상 주문수량',
    '문의내용',
    '개인정보동의'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#dc2626');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // 열 너비 조정
  sheet.setColumnWidth(1, 150); // 접수일시
  sheet.setColumnWidth(2, 150); // 이름/회사명
  sheet.setColumnWidth(3, 130); // 연락처
  sheet.setColumnWidth(4, 200); // 이메일
  sheet.setColumnWidth(5, 200); // 관심 카테고리
  sheet.setColumnWidth(6, 120); // 예상 주문수량
  sheet.setColumnWidth(7, 300); // 문의내용
  sheet.setColumnWidth(8, 100); // 개인정보동의

  // 첫 번째 행 고정
  sheet.setFrozenRows(1);

  Logger.log('시트가 초기화되었습니다.');
}
