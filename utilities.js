
//waitFor(locator): locator가 로딩될 때까지 대기한다. (타임아웃:10초)
//locator string을 구별 (0:selector / 1~:xPath)
//inputType: text
//ouputType: number
module.exports.waitFor = waitFor;
async function waitFor(locator){  
    
    let count = null;
    try{
        count = (locator.match(/\//g) || []).length;    //타겟 스트링에서 "/" 문자 수 카운팅하여 selector OR xpath 구별
       
        if(count<1){
            element = await page.waitForSelector(locator, {visible:true, timeout:10000});
        } else{
            element = await page.waitForXPath(locator, {visible:true, timeout:10000});
        }

    } catch (error) {
        console.log("다음 요소를 찾을 수 없음: " + locator + "\n" + error);
    }
    
    return count;
}



//waitForHidden(locator): locator가 사라질 때까지 대기한다. (타임아웃:10초)
//locator string을 구별하여 integer 형태로 반환 (0:selector / 1~:xPath)
//inputType: text
//ouputType: number
module.exports.waitForHidden = waitForHidden;
async function waitForHidden(locator){  
    
    let count = null;
    try{
        count = (locator.match(/\//g) || []).length;     //타겟 스트링에서 "/" 문자 수 카운팅하여 selector OR xpath 구별
      
        if(count<1){
            element = await page.waitForSelector(locator, {hidden:true, timeout:10000});
        } else{
            element = await page.waitForXPath(locator, {hidden:true, timeout:10000});
        }

    } catch (error) {
      console.log("다음 요소가 사라지지 않음: " + locator + "\n" + error);
    }
    return count;
}



//waitForDomLoaded (): 페이지의 domcontent가 로딩될 때까지 대기한다. (타임아웃:10초)
//inputType: n/a
//ouputType: n/a
module.exports.waitForDomLoaded = waitForDomLoaded ;
async function waitForDomLoaded (){  
    try{
        await page.waitForNavigation({waitUntil: 'domcontentloaded', timeout:10000});
    
    } catch(error) {
        console.log('페이지의 domcontent가 정상적으로 로딩되지 않음');
    }
}



//isElementVisible(locator): locator가 화면에 존재하는 하는지 확인한다. (타임아웃: 10초)
//boolean 형태로 반환
//inputType: text
//ouputType: boolean
module.exports.isElementVisible = isElementVisible;
async function isElementVisible(locator){

    let isVisible= null;
    let count = null;

    try{
        count = (locator.match(/\//g) || []).length;     //타겟 스트링에서 "/" 문자 수 카운팅하여 selector OR xpath 구별

        if(count<1){
        element = await page.waitForSelector(locator, {visible:true, timeout:10000}).then(() => isVisible = true);
        } else{
        element = await page.waitForXPath(locator, {visible:true, timeout:10000}).then(() => isVisible = true);
        }
        
    } catch(error){
        isVisible = false;
        console.log('다음 요소를 찾을 수 없음 : ' + locator + '\n' + error);
    }

  return isVisible;
}



//goTo(url): page 이동 후, load가 완료될 때까지 대기 (타임아웃: 10초)
//inputType: text
//ouputType: n/a
module.exports.goTo = goTo;
async function goTo(url) {
  try{
      await page.goto(url, {waitUntil: 'load', timeout:10000});

  } catch(error){
      console.log('다음 페이지에 접속할 수 없음: ' + url + '\n' + error);
  }
}



//click(locator): locator에 해당하는 element를 클릭한다. (타임아웃: 10초)
//inputType: text
//ouputType: n/a
module.exports.click = click;
async function click(locator){
  let count = await waitFor(locator);
  try{
      if(count<1){
          await page.click(locator);
      } else{
          let [element] = await page.$x(xpath);
          await element.click();
      }

  } catch(error) {
    console.log('다음 요소를 클릭할 수 없음: ' + locator + '\n' + error);
  }
}



//type(locator, text): 해당 element에 텍스트를 입력한다. 
//inputType: text, text
//ouputType: n/a
module.exports.type = type;
async function type(locator, text){
  let count = await waitFor(locator);
  try{
      if(count<1){
          console.log('css Selector');
          let element = await page.$(locator);
          await page.type(locator, text); 
      } else{
        console.log('xpath');
          let [element] = await page.$x(locator);
          await element.type(text);
      }

  } catch(error) {
      console.log('다음 영역에 텍스트 입력불가: ' + locator + '\n' + error);
  }
}


 
//type(locator, text): 해당 element에 입력된 텍스트를 삭제 후, 새 텍스트를 입력한다. 
//inputType: text, text
//ouputType: n/a
module.exports.clearAndType = clearAndType;
async function clearAndType(locator, text){
  let count = await waitFor(locator);
  try{
      if(count<1){
          let element = await page.$(locator);
          await element.click();
          await element.focus();
          await page.keyboard.down('Control');
          await page.keyboard.press('A');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await page.type(locator, text);    
      } else{        
          console.log('xpath 위치에 입력된 텍스트 전체 삭제 후 새로입력');
          let [element] = await page.$x(locator);
          await element.click();
          await element.focus();
          await page.keyboard.down( 'Control' );
          await page.keyboard.press( 'A' );
          await page.keyboard.up( 'Control' );
          await page.keyboard.press( 'Backspace' );
          await element.type(text);
      }

  } catch(error){
      console.log('다음 영역에 텍스트 삭제 후 입력 실패: ' + locator + '\n' + error);
  }
}



//getText(selector) : 해당 element에 포함된 텍스트를 반환한다.    
//inputType: text
//ouputType: text
module.exports.getText = getText;
async function getText(selector) {
  let text = null;
  try{
      await waitFor(selector);
      let element = await page.$(selector);
      let textHandle = await element.getProperty('textContent');
      text = await textHandle.jsonValue();
      console.log(selector +'에 포함된 Text: ' + text);

  } catch(error){
      console.log('텍스트 확인 실패: ' + selector + '에서 textContent를 찾을 수 없음' + '\n' + error);
  }

  return text;
}


//getValue(selector): 해당 element에 포함된 value를 반환한다.
//inputType: text
//ouputType: text
module.exports.getValue = getValue;
async function getValue(selector) {
  let value = null;
  try{
      await waitFor(selector);
      let element = await page.$(selector);
      let valueHandle = await element.getProperty('value');
      value = await valueHandle.jsonValue();

  } catch(error){
      console.log('value 확인 실패: ' + selector + '에서 value를 찾을 수 없음' + '\n' + error);
  }
  
  return value;
}


//getInnnerHTML(selector): 해당 element에 포함된 innerText를 반환한다.
//inputType: text
//ouputType: text
module.exports.getInnnerText = getInnnerText ;
async function getInnnerText(selector) {
    let innerText = null;
    try{
        await waitFor(selector);
        let element = await page.$(selector);
        let innerTextHandle = await element.getProperty('innerText');
        innerText = await innerTextHandle.jsonValue();
    } catch(error){
        console.log('innerText 확인 실패: ' + selector + '에서 innerText를 찾을 수 없음' + '\n' + error);
    }
    
  return innnerText;
}


//getActivePages(): 현재 Active 상태인(화면에 보여지는) Page들을 반환한다. 
//inputType: n/a
//ouputType: page
module.exports.getActivePages = getActivePages;
async function getActivePages() {

    let pages = null;
    let activePages = [];
    try{
        pages = await browser.pages();    
        for(let page of pages) {
            if(await page.evaluate(() => { return document.visibilityState == 'visible' })) {
                activePages.push(page);
            }
        }

    } catch(error){
      console.log('Page 찾기 실패: Active 상태인 Page를 찾을 수 없음' + '\n' + error);
  }

  return activePages;
}


//getNewPage(): 새로 열린 Page를 반환한다.(팝업창 or 새탭)
//inputType: n/a
//ouputType: page
module.exports.getNewPage = getNewPage;
async function getNewPage(){
    
    let newPage = null;
    try{
        let newPagePromise = new Promise(response => browser.on('targetcreated', response));
        await newPagePromise;
        let pages = await browser.pages();
        newPage = pages[pages.length - 1];
    
    } catch(error){
        console.log('새 Page 열기 실패: 새로 열린 Page를 찾을 수 없음' + '\n' + error);
    }

  return newPage;
}



//switchPage(title): 입력받은 타이틀과 일치하는 Page를 반환한다.
//inputType: text
//ouputType: page
module.exports.switchPage = switchPage;
async function switchPage(title){

    let selectedPage = null;  
    try{
        let pages = await browser.pages();

        for (let page of pages) {
            let targetTitle = await page.title();
            if(targetTitle == title){
                selectedPage = page; 
                break;
            }
        }

        if(selectedPage==null){
            throw Error('Title이 일치하는 Page를 찾을 수 없음');
        }
        
    } catch(error){
        console.log('Page 전환 실패: Title이 \'' + title  + '\'인 Page로 전환 할 수 없음' + '\n' + error);
    }

    return selectedPage;
}



//getPageCount(): 현재 Browser에 열려있는 전체 Page 수를 확인한다.
//inputType: n/a
//ouputType: number
module.exports.getPageCount = getPageCount;
async function getPageCount() {
    let pages = await browser.pages();
    let count = await pages.length;

    return count;
}



//uploadFile(selector, filepath): 해당 Element에 파일을 업로드 (input의 type이 file인 Element)
//inputType: text, text
//ouputType: number
module.exports.uploadFile = uploadFile;
async function uploadFile(selector, filepath){
    try{
        await waitFor(selector);
        let input = await page.$(selector);
        await input.uploadFile(filepath);

    } catch(error){
        console.log('업로드 실패: '+ filepath + ' 파일의 업로드 실패함'+ '\n' + error);
    }
}


