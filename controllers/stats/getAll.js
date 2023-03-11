// const { Contact } = require("../../model/contacts/contact");
const fs = require('fs');
const Path = require('path')

let rawdata = fs.readFileSync(Path.resolve(__dirname, '../../templates/' + 'zero-one.json'));
let Data = JSON.parse(rawdata);

let data = Data
let FIND_SEQUENCE = [1, 1, 0, 1, 1, 0, 1, 1, 0]
let count = []
let dataAfter = []
let COUNT_AFTER = 10
let DATE_AFTER = []
// 90%
let secondCount = []
// 80%
let thirdCount = []
let stats = {
  first:{},
  randomFirst: {},
  second:{},
  third:{}
}

const getAll = async (req, res, next) => {
  FIND_SEQUENCE = req.query.seq.split(',')
  DATE_AFTER = req?.query?.dateAfter?.split(',')
  const stats = []
  DATE_AFTER.map(date=>{
    const data = []
    let [from, to] = date.split('-')
    while (Number(from) <= Number(to)) {
      COUNT_AFTER = from 
      const obj = find()
      data.push({stats: obj, h: from})
      from = Number(from) + 2;
    }
    stats.push({data, label:date})
  })
  

  // const { page = 1, limit = 10 } = req.query;
  // console.log(req.query)
  // const skip = (page - 1) * limit;
  // const result = await Contact.find({}, "", {
  //   skip,
  //   limit: 25,
  // }).sort({createdAt:-1});
  res.status(200).json({
    status: "succsess",
    code: 200,
    data: stats,
  });
};


const find = ()=>{
  count = []
  data = Data
  stats = {
    first:{},
    second:{},
    third:{}
  }
  charts = []
  secondCount = []
  thirdCount = []
  this.dataAfter = []
  count = findSequence(FIND_SEQUENCE, data)
  console.log(count.length)
  let [dataAfter, croppedArray] = findDateAfter(count, data)
  // ONLY FOR CHARTS (maybe)
  let randomDataAfter = getRandomData(dataAfter)
  randomDataAfter = dataForChart(randomDataAfter)
  stats.randomFirst = getStats(randomDataAfter)

  dataAfter = dataForChart(dataAfter)
  charts.push({p:'100', data: dataAfter})
  stats.first = getStats(dataAfter)
  // renderCharts('generalLineChart', generalChart.nativeElement, dataAfter)
  // ------------------
  // 90%
  if(FIND_SEQUENCE.length<7)return {stats, charts}

  if(FIND_SEQUENCE.length>7&&FIND_SEQUENCE.length<15){
    secondCount.push(...findSequence(FIND_SEQUENCE.slice(1,FIND_SEQUENCE.length), croppedArray))
    secondCount.push(...findSequence(FIND_SEQUENCE.slice(0,-1), croppedArray))
  }
  console.log("Secound",secondCount.length)
  secondCount.sort((a,b)=>{return a.from>b.from?1:-1})
  let [secoundDateAfter, croppedArraySecond] = findDateAfter(secondCount, croppedArray)
  secoundDateAfter = dataForChart(secoundDateAfter)
  charts.push({p:'90', data: secoundDateAfter})
  
  if(secoundDateAfter.length){
    stats.second = getStats(secoundDateAfter)
  }

  // renderCharts('secontLineChart', secondChart.nativeElement, secoundDateAfter)  
  // 80% 
  if(FIND_SEQUENCE.length<10)return {stats, charts}
  if(FIND_SEQUENCE.length<13){
    thirdCount.push(...findSequence(FIND_SEQUENCE.slice(2,FIND_SEQUENCE.length), croppedArraySecond))
    thirdCount.push(...findSequence(FIND_SEQUENCE.slice(0,-2), croppedArraySecond))
  }else{
    thirdCount.push(...findSequence(FIND_SEQUENCE.slice(3,FIND_SEQUENCE.length), croppedArraySecond))
    thirdCount.push(...findSequence(FIND_SEQUENCE.slice(0,-3), croppedArraySecond))
  }
 
  thirdCount.sort((a,b)=>{return a.from>b.from?1:-1})
  let [thirdDateAfter] = findDateAfter(thirdCount, croppedArraySecond)
  thirdDateAfter = dataForChart(thirdDateAfter)
  if(!thirdDateAfter.length) return{stats, charts}
  charts.push({p:'80', data: thirdDateAfter})
  stats.third = getStats(thirdDateAfter)

  // renderCharts('thirdLineChart', thirdChart.nativeElement, thirdDateAfter)  
  return {stats, charts}
}

function findSequence(sequense, data){
  const count = []
  for(let i = 0; i < data.length; i++){
    let isEqual = false
    for(let s = 0;s < sequense.length; s++){
      isEqual = data[i+s] === +sequense[s]
      if(!isEqual)break
    }
    if(isEqual)count.push({from:i, to: i+sequense.length})
  }
  return count
}
function findDateAfter(counts, data){
  const dataAfter = []
  const croppedArray = []
  counts.reduce((prev,current,i, array)=>{
    let from = current.to
    let to =  from + COUNT_AFTER 
    dataAfter.push(data.slice(from, to)) 
    croppedArray.push(...data.slice(prev, current.from))
    if(array.length === i+1){
      croppedArray.push(...data.slice(current.to + COUNT_AFTER,data.length))
    }
    return current.to + COUNT_AFTER
  },0)
  return [dataAfter, croppedArray]
}
function dataForChart(dataAfter){
  return dataAfter.map(a=>{
    let initial = 0
    return a.map((current)=>{
      if(current){
        initial += current
        return initial
      }else{
        initial = initial-1
        return initial
      }
    })
  })
}

function getStats(data){
  let zero = {value:data.filter(obj=>obj[obj.length-1]===0).length,desc: 'ZERO'}
  let plus = {value: data.filter(obj=>obj[obj.length-1]>0).length, desc: 'PLUS'}
  let minus = {value: data.filter(obj=>obj[obj.length-1]<0).length, desc: 'MINUS'}
  let sortedArray = [plus, minus].sort((a,b)=>a.value>b.value?-1:1)
  sortedArray[0] = {value: sortedArray[0].value + zero.value / 2, desc: sortedArray[0].desc}
  sortedArray = [...sortedArray, zero].sort((a,b)=>a.value>b.value?-1:1)

  let stats = {
    count:data.length,
    zero:((100*zero.value)/data.length).toFixed(1),
    plus:((100*plus.value)/data.length).toFixed(1),
    minus:((100*minus.value)/data.length).toFixed(1),
    result: {
      value: ((100*sortedArray[0].value)/data.length).toFixed(1),
      desc: sortedArray[0].desc
    }
  }
  return stats
}

// function renderCharts(prop, el, data){
//   const labels = []
//   const datasets = []
//   for(let i = 1; i <= COUNT_AFTER; i++){labels.push(i)}
//   for(let i = 0; i < data.length; i++){
//     const color = randColor()
//     datasets.push({
//       label: 'Count '+(i+1),
//       data: data[i],
//       backgroundColor: [
//         color
//       ],
//       borderColor: [
//         color,
//       ],
//       borderWidth: 1,
//   })
    
//   }
//   datasets.push({
//     label: 'Solid Black',
//     data: labels.map(l=>{return 0}),
//     backgroundColor: [
//       '#000'
//     ],
//     borderColor: [
//       '#000',
//     ],
//     borderWidth: 2,
// })

//   if (this[prop]) {
//     this[prop].data.datasets = datasets
//     this[prop].data.labels = labels
//     return this[prop].update()
//   }

//   this[prop] = new Chart(el, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: datasets,
//     },
//     options: {
//         responsive: true,
//     }
// })
// }

function getRandomData(array){
  return array.map(a=>{
    return a.map(o=>{
      return Math.floor(Math.random() * 2)
    })
  })
}

function updateSequence(event){
  FIND_SEQUENCE = event.target.value.split(' ')
  find()
}
function updateCountAfter(event){
  COUNT_AFTER = +event.target.value
  find()
}

function randColor(){
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

module.exports = { getAll };
