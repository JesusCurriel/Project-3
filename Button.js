function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
function createButtons(L)
{

    for (let i = 1; i < 78; i++)
    {
        let btn = document.createElement("button");
        btn.innerHTML = i;
        btn.className = "Numbers";
        btn.value = 0
        btn.id = i;
        btn.addEventListener('click', () => {
            if(btn.value == 0)
            {
                ElementsClicked.push(btn.id)
                btn.style.backgroundColor = "#417BA0"
                btn.value = 1
                L.eachLayer(function (layer) {  
                    if(layer._leaflet_id == btn.id)
                    {
                        layer.setStyle({fillColor :'blue'}) 
                        console.log(layer._leaflet_id)
                        console.log(btn.id)
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
                    removeItem(ElementsClicked, btn.id);
                     
                    
                  });

            }
            updateBars(ElementsClicked)
            
          })
          btn.addEventListener('mouseover', () => {
            if(btn.value == 0)
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
            if(btn.value == 0)
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
