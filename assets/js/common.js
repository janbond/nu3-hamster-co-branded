// 活曜值進度條
const getActiveVal = document.getElementById('getActiveVal');
function runActiveProgress() {
  let activeVal = 155; // 後端傳來的值寫在這，小單位都是 0 10 15 這樣加上去

  if(activeVal <= 30) {
    getActiveVal.style.setProperty('width', `25%`)
    if(activeVal === 10) getActiveVal.style.setProperty('width', `34.5%`)
    else if(activeVal === 15) getActiveVal.style.setProperty('width', `36.7%`)
    else if(activeVal === 20) getActiveVal.style.setProperty('width', `38.9%`)
    else if(activeVal === 25) getActiveVal.style.setProperty('width', `41%`)
    else if(activeVal === 30) getActiveVal.style.setProperty('width', `47.5%`)
  } else { // 一次活曜值最少 5 起跳
    console.log('超過30')
    const parts = 24 // 30 後到 150，有 24 等份
    const oneTime = 5 // 最小單位 5
    let arr = Array.from({ length: parts }, function(num, i) {
      return ((i + 1) * oneTime) + 30;
    });
    console.log(arr)
    const filterActiveVal = arr.indexOf(activeVal) + 1
    
    if(activeVal <= 55) getActiveVal.style.setProperty('width', `${47.5 + (filterActiveVal * 1.4)}%`)
    else if(activeVal === 60) getActiveVal.style.setProperty('width', `60.5%`) // 用 55 的 54.5% + 6%
    else if(activeVal > 60 && activeVal <= 85) getActiveVal.style.setProperty('width', `${47.5 + (6 - 1.4) + (filterActiveVal * 1.4)}%`)
    else if(activeVal === 90) getActiveVal.style.setProperty('width', `73.5%`) // 用 85 的 67.5% + 6%
    else if(activeVal > 90 && activeVal <= 115) getActiveVal.style.setProperty('width', `${47.5 + ((6 - 1.4) * 2) + (filterActiveVal * 1.4)}%`)
    else if(activeVal === 120) getActiveVal.style.setProperty('width', `86.5%`) // 用 115 的 80.5% + 6%
    else if(activeVal > 120 && activeVal <= 145) getActiveVal.style.setProperty('width', `${47.5 + ((6 - 1.4) * 3) + (filterActiveVal * 1.4)}%`)
    else if(activeVal >= 150) getActiveVal.style.setProperty('width', `100%`) // 最後一個，直接 100%
  }
}
runActiveProgress()

const letsGo = document.querySelector('.letsGoBtn');
const diceImg = document.getElementById('diceImg');
const role = document.querySelector('.role');
const roleImg = document.querySelector('.role img');
const roleTarget = document.querySelector('.roleTarget');
const roleTargetImg = document.querySelector('.roleTargetImg');
const finishTimes = document.querySelector('.finishTimes');
const hasDiceQuantity = document.querySelector('.hasDiceQuantity');
const cardCont = document.querySelector('.cardCont');
const chanceCard = document.querySelector('.chanceCard');
const destinyCard = document.querySelector('.destinyCard');
const whatYouGetCard = document.getElementById('whatYouGetCard');
const flipContainer = document.querySelectorAll('.flipContainer');
const cardBreatheAn = document.querySelectorAll('.cardBreatheAn');
let giftModal = new bootstrap.Modal(document.getElementById("giftModal"), {});
let noteModal = new bootstrap.Modal(document.getElementById("noteModal"), {});
const checkGiftBtn = document.getElementById('checkGiftBtn');
const innerNoteTxt = document.getElementById('innerNoteTxt');
let canGoOrNot = true;
let times = 0;
let diceQuantity = 0;
const maxGrid = 16;
let positionRecord = 'b1'; // 後端帶入格子位置紀錄
const startPoint = document.getElementById('b1');
const startPointChild = startPoint.querySelector('.roleTarget');
const allMpMap = document.querySelectorAll('.mpMap');
// 一開始先定位 role 座標位置
if(positionRecord !== 'b1') { // 判斷位置不在 b1
  let recordGrid = parseInt(positionRecord.split('b')[1]);
  const recordPoint = document.getElementById(positionRecord);
  recordPoint.classList.add('targetLight');
  recordPoint.appendChild(roleTarget);
  roleTargetImg.src = `assets/images/square_${recordGrid}_hover.png`
  rolePosition(recordPoint)
} else { // 在 b1，所以角色在起點
  rolePosition(startPoint)
}
// 偵測螢幕變動，重新定位角色位置
window.addEventListener('resize', function() {
  if(startPointChild) rolePosition(startPoint)
  const filterAllMpMap = Array.from(allMpMap).filter(item => {
    return item.classList.contains('targetLight')
  })
  rolePosition(filterAllMpMap[0]);
});

role.classList.add('show')
let diceNum = getDiceQuantity() // 一開始先取得骰子數
// 骰子按鈕按下去
letsGo.addEventListener('click', function() {
  if(diceNum !== 0) {
    if(canGoOrNot) {
      let num = dice()
      let currentGrid = parseInt(roleTarget.parentNode.id.split('b')[1]);
      let targetGrid = currentGrid + num;
      console.log('canGoOrNot', canGoOrNot)
      // hideDrawCard()
      run(num, currentGrid, targetGrid)
    } else {
      innerNoteTxt.innerHTML = '請先把機會命運使用完畢'
      noteModal.show()
    }
  } else {
    innerNoteTxt.innerHTML = '次數用完囉'
    noteModal.show()
  }
})
// 得獎視窗的確定按鈕按下去
// checkGiftBtn.addEventListener('click', function() {
//   hideDrawCard()
// })
// 骰完骰子開始走
function run(num, currentGrid, targetGrid) {
  letsGo.disabled = true

  let interval = setInterval(function() {
    document.getElementById(`b${currentGrid}`).classList.remove('targetLight');
    currentGrid++
    
    roleImg.classList.remove('jumpAn');
    
    if(currentGrid <= targetGrid) {
      if(currentGrid > maxGrid) {
        currentGrid = 1
        targetGrid = targetGrid - maxGrid
        hideDrawCard() // 走完一圈牌蓋上
        times++ // 完成一圈就 + 1
        finishTimes.innerHTML = times

        console.log('走完一圈，出現機會命運卡')
        getDrawCard()
      }
      if(currentGrid > 4 && currentGrid < 13) {
        role.classList.add('rightSide')
      } else {
        role.classList.remove('rightSide')
      }
      console.log(num, 'currentGrid', currentGrid, 'targetGrid', targetGrid)
      let newGridId = `b${currentGrid}`;
      let newGrid = document.getElementById(newGridId); // 取得目前的格子 id
      setTimeout(function() {
        newGrid.classList.add('light');
        actB()
      }, 300)
      function actB() {
        setTimeout(function() {
          newGrid.classList.remove('light');
        }, 500)
      }

      rolePosition(newGrid);

      if(newGrid) {
        setTimeout(function() {
          newGrid.appendChild(roleTarget);
          roleTargetImg.src = `assets/images/square_${currentGrid}_hover.png`
        }, 300)
      }
    } else { // 走完後
      clearInterval(interval);

      document.getElementById(`b${targetGrid}`).classList.add('targetLight');
      setTimeout(function() {
        roleTargetImg.src = `assets/images/square_${targetGrid}_hover.png`
      }, 200)
      // 判斷在起點可獲得一顆骰子
      if(currentGrid === 2 && targetGrid === 1) {
        console.log('我在起點上，可以得到一顆骰子')
        innerNoteTxt.innerHTML = '恭喜，可以得到一顆骰子'
        noteModal.show()
      }
      
      letsGo.disabled = false
    }
  }, 500);
}
// 角色定位
function rolePosition(obj) {
  let cellRect = obj.getBoundingClientRect();
  let newTop = cellRect.top + window.scrollY;
  let newLeft = cellRect.left + window.scrollX;

  roleImg.classList.add('jumpAn');
  role.style.top = newTop + 'px';
  role.style.left = newLeft + 'px';
}
// 擲骰子隨機亂數
function dice() {
  let num = Math.floor(Math.random() * 6) + 1;
  diceImg.className = 'dice'
  diceImg.classList.add('scrollDiceAn')
  setTimeout(function() {
    diceImg.className = 'dice'
    diceImg.classList.add(`dice_${num}`)
  }, 500)
  return num
}
// 取得可以使用的骰子數
function getDiceQuantity(num) {
  diceQuantity = 10
  // if(num) {

  // }
  hasDiceQuantity.innerHTML = diceQuantity
  return diceQuantity
}
// 得到(出現)機會命運卡
function getDrawCard() {
  canGoOrNot = false
  chanceCard.classList.add('show')
  destinyCard.classList.add('show')
  chanceCard.classList.add('cardScaleAn')
  destinyCard.classList.add('cardScaleAn')
  for(let i = 0; i < cardBreatheAn.length; i++) {
    setTimeout(function() {
      cardBreatheAn[i].style.setProperty('display', 'block')
    }, 300)
  }
}
// 點擊機會命運卡下去抽卡開始
chanceCard.addEventListener('click', function() {
  actionDrawCard(this)
})
destinyCard.addEventListener('click', function() {
  actionDrawCard(this)
})
function actionDrawCard(item) {
  if(!canGoOrNot) { // 先判斷可不可以抽卡
    for(let i = 0; i < flipContainer.length; i++) {
      flipContainer[1].classList.add('click')
      setTimeout(function() {
        flipContainer[0].classList.add('clickLonger')
      }, 1000)
      cardBreatheAn[i].style.setProperty('display', 'none')
    }
    canGoOrNot = true
    console.log('抽卡')
  } else {
    console.log('不能抽卡')
    if(times > 0) { // 判斷跑完一圈才能打開卡片彈窗
      whatYouGetCard.src = item.querySelector('.getCard').src
      giftModal.show()
    }
  }
}
// cardCont.addEventListener('click', function() {
  
// })
// 重置機會命運卡
function hideDrawCard() {
  canGoOrNot = true
  chanceCard.classList.remove('show')
  destinyCard.classList.remove('show')
  for(let i = 0; i < flipContainer.length; i++) {
    flipContainer[1].classList.remove('click')
    flipContainer[0].classList.remove('clickLonger')
    cardBreatheAn[i].style.setProperty('display', 'none')
  }
}

// 表單驗證
(function () {
  'use strict'
  var forms = document.querySelectorAll('.needs-validation')
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
})()

jQuery(document).ready(function(e) {
  let h = $('nav.navbar').height()
  let nav = $('.navbar-collapse.justify-content-center.collapse')
  jQuery('.nav-link').on('click', function(event) {
    var $anchor = $(this);
    jQuery('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - h
      // scrollTop
    }, 1500);
    nav.removeClass('show');
    event.preventDefault();
  });
});