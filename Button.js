function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
function createButtons(L)
{
        /*
        #4CAF50 Green
        #66BCF2 light blue
        #417BA0 Dark Blue
        
        */

    for (let i = 1; i < 78; i++)
    {
        let btn = document.createElement("button");
        btn.innerHTML = i;
        btn.className = "Numbers";
        btn.value = 0
        btn.id = i;
        btn.style.background = "#4CAF50"
        btn.addEventListener('click', () => {

            if(btn.style.backgroundColor == "rgb(102, 188, 242)")
            {

                console.log("CLICK!")
                console.log(ElementsClicked)

                ElementsClicked.push(btn.id)


      
                btn.style.backgroundColor = "#417BA0"
                btn.value = 1
                L.eachLayer(function (layer) {  
                    if(layer._leaflet_id == btn.id)
                    {
                        layer.setStyle({fillColor :'blue'}) 

                    }
                   
                    
                  });
                
                
            }
            else
            {
                btn.style.backgroundColor = "#4CAF50"
                btn.value = 0
                L.eachLayer(function (layer) {  
                    if(layer._leaflet_id == btn.id)
                    {
                        L.resetStyle(layer);
                        
                    }
                    
                     
                    
                  });
                  removeItem(ElementsClicked, btn.id);
                  console.log("UNCLICK!")
                  console.log(ElementsClicked)

            }
            updateBars(ElementsClicked)
            
          })
          btn.addEventListener('mouseover', () => {
            console.log(btn.style)
            console.log(btn.style.backgroundColor)
            if(btn.style.backgroundColor == "rgb(76, 175, 80)")
            {
                
                btn.style.backgroundColor = "#66BCF2"
                L.eachLayer(function (layer) {  
                    if(layer._leaflet_id == btn.id)
                    {
                        layer.setStyle({
                            weight: 5,
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                    }
                     
                    
                  });
            }
            
          })
          
          btn.addEventListener('mouseout', () => {
            if(btn.style.backgroundColor == "rgb(102, 188, 242)")
            {
                btn.style.backgroundColor = "#4CAF50"
                L.eachLayer(function (layer) {  
                    if(layer._leaflet_id == btn.id)
                    {
                        L.resetStyle(layer);
                    }
                     
                    
                  });
            }
            
          })
          
        
        document.getElementById("Num").appendChild(btn);
    }

}

function ButtonClick(btn)
{
    btn.style.backgroundColor = "#4CAF50"
}
function ButtonHover(element)
{
    element.style.backgroundColor = "#66BCF2"
}
