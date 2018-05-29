import React, { Component } from 'react';
import './App.css';

const obj = {
    quick: 1,
    heap: 2,
    others: 3
}
const algo = Object.freeze(obj);
const xp = 25, yp = 20, len = 50;
var queue_quick = [], queue_heap = [];
var canvas_quicksort, canvas_heapsort;
var array_quick = [], array_heap = [];
var quicksortGenerator, heapsortGenerator;
var swapQuickIndex1 = -1, swapQuickIndex2 = -1;
var swapHeapIndex1 = -1, swapHeapIndex2 = -1;

var array = Array.apply(null, Array(len)).map(function() {
        return Math.round(1 + Math.random() * 100);
    });

/*This function checks if array is sorted. */
function checkSorted(list){
    for(var i=0;i<list.length-1;i++){
        if(list[i].value > list[i+1].value){
            return false;
        }
    }
    return true;
}

/*This function sorts array and generates canvas by frame. */
function* createSortedQuick(list){
  var n = queue_quick.length;
  var sorted = checkSorted(list);
  do{
      for(var i=0;i<n;i++){
          var pair = queue_quick[i];
          swapQuickIndex1 = findIndex(pair[0],list);
          swapQuickIndex2 = findIndex(pair[1],list);
          swap(list,swapQuickIndex1,swapQuickIndex2, false);
          yield sorted;
          sorted = checkSorted(list);
      }
  } while(!sorted)
}

/*This function sorts array and generates canvas by frame. */
function* createSortedHeap(list){
  var n = queue_heap.length;
  var sorted = checkSorted(list);
  do{
      for(var i=0;i<n;i++){
          var pair = queue_heap[i];
          swapHeapIndex1 = findIndex(pair[0],list);
          swapHeapIndex2 = findIndex(pair[1],list);
          swap(list,swapHeapIndex1,swapHeapIndex2, false);
          yield sorted;
          sorted = checkSorted(list);
      }
  } while(!sorted)
}

/*This function finds index of element by their keys. */
function findIndex(keyToFind, list){
    for(var i=0;i<list.length;i++){
        if(list[i].key === keyToFind){
            return i;
        }
    }
}

/*This function clears and draws canvas with rectangles. */
function draw(canvas, myarray, algorithm){
    console.log('draw');
    var ctx = canvas.getContext('2d'), i;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(algorithm === algo.quick){
        if (canvas.getContext) {
            for (i = 0; i < myarray.length; i++) {
                if( (i === swapQuickIndex1 && swapQuickIndex1 !== -1) | (i === swapQuickIndex2 && swapQuickIndex2 !== -1) ){
                    ctx.fillStyle="#FF0000";
                    ctx.fillRect(10 + xp *i , yp, 20, myarray[i].value*2);
                }
                else{
                    ctx.fillStyle="#000000";
                    ctx.fillRect(10 + xp *i , yp, 20, myarray[i].value*2);
                }
            }
        }
    }else if(algorithm === algo.heap){
        if (canvas.getContext) {
            for (i = 0; i < myarray.length; i++) {
                if( (i === swapHeapIndex1 && swapHeapIndex1 !== -1) | (i === swapHeapIndex2 && swapHeapIndex2 !== -1) ){
                    ctx.fillStyle="#FF0000";
                    ctx.fillRect(10 + xp *i , yp, 20, myarray[i].value*2);
                }
                else{
                    ctx.fillStyle="#000000";
                    ctx.fillRect(10 + xp *i , yp, 20, myarray[i].value*2);
                }
            }
        }
    }
}

/*This function allows execution of the program to 'wait' for ms milliseconds. */
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

/*This function draws reference from
http://khan4019.github.io/front-end-Interview-Questions/sort.html#quickSort */
function quickSort(arr, left, right){
    // eslint-disable-next-line
    var len = arr.length,
    pivot,
    partitionIndex;

    if(left < right){
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);
        //sort left and right
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}

/*This function draws reference from
http://khan4019.github.io/front-end-Interview-Questions/sort.html#quickSort */
function partition(arr, pivot, left, right){

    var pivotValue = arr[pivot].value, partitionIndex = left;
    for(var i = left; i < right; i++){
        if(arr[i].value < pivotValue){
            swap(arr, i, partitionIndex, algo.quick);
            partitionIndex++;

        }
    }
    swap(arr, right, partitionIndex, algo.quick);
    return partitionIndex;
}

/*This function swaps two elements in array. */
function swap(array, indexA, indexB, algorithm) {

    var pair = [array[indexA].key, array[indexB].key];
    if(algorithm === algo.quick)queue_quick.push(pair);
    else if(algorithm === algo.heap)queue_heap.push(pair);

    var tmp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = tmp;
}

/*This function draws reference from https://www.geeksforgeeks.org/heap-sort/. */
function heapify(arr,n,i){
    var largest = i;
    var l = 2*i + 1;
    var r = 2*i + 2;

    if(l<n && arr[l].value > arr[largest].value){
        largest = l;
    }
    if(r<n && arr[r].value > arr[largest].value){
        largest = r;
    }
    if(largest !== i){
        swap(arr, i, largest, algo.heap);
        heapify(arr,n,largest);
    }
}

/*This function draws reference from https://www.geeksforgeeks.org/heap-sort/. */
function heapSort(arr, n){
    for(var i=Math.round(n/2)-2;i>=0;i--){
        heapify(arr,n,i);
    }
    for(var j=n-1;j>=0;j--){
        swap(arr,0,j,algo.heap);
        heapify(arr,j,0);
    }
}

class App extends Component {

    componentDidMount(){
        canvas_quicksort = this.refs.canvas_quicksort;
        canvas_heapsort = this.refs.canvas_heapsort;
        for(var i=0;i<len;i++){
            var obj = {key: i+1, value: array[i]}
            array_quick.push(obj);
            array_heap.push(obj);
        }
        draw(canvas_quicksort, array_quick, algo.quick);
        draw(canvas_heapsort, array_heap, algo.heap);
    }

    /*This function initiates sorting algorithm. */
    handleSort(){
        var listQuick = array_quick.slice();
        quickSort(listQuick, 0, listQuick.length-1);
        var listHeap = array_heap.slice();
        heapSort(listHeap,listHeap.length);

        quicksortGenerator = createSortedQuick(array_quick, queue_quick);
        heapsortGenerator = createSortedHeap(array_heap, queue_heap);
        function anim(){
            requestAnimationFrame(anim);
            draw(canvas_quicksort, array_quick, algo.quick);
            draw(canvas_heapsort, array_heap, algo.heap);
            wait(200);
            quicksortGenerator.next();
            heapsortGenerator.next();
         }
        anim();
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign:"center"}} className="title">Quick Sort</h1>
                <canvas ref="canvas_quicksort" width={window.innerWidth} height={220} />
                <h1 style={{textAlign:"center"}} className="title">Heap Sort</h1>
                <canvas ref="canvas_heapsort" width={window.innerWidth} height={220} />
                <div style={{textAlign:"center"}}>
                    <button class="sortButton" onClick={() => this.handleSort()}>sort</button>
                </div>
             </div>
        );
    }
}

export default App;
