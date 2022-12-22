const table = document.getElementById('tbl')
var tableBody = table.getElementsByTagName('tbody')[0];
let currentPage=1;
var rows_per_page=8;
const rows = document.getElementsByClassName("btn-check")
var pre=null;
var veriler;
const renderPosts = async() => {
    let uri = 'http://localhost:3000/students'
    const res = await fetch(uri);
    const posts = await res.json();
    dataLength = posts.length
    veriler = posts;
    template = " ";
    pagination(veriler,rows_per_page);
    display(veriler,rows_per_page,currentPage)
}
    for(let a=0; a<3; a++)
    {
        rows[a].addEventListener('change',function()
        {
            (pre)? console.log(pre.value):null
            if(this!==pre){
                rows_per_page = this.value;
            }
            template = " ";
            pagination(veriler,rows_per_page)
            display(veriler,rows_per_page,currentPage)
        })
    }

function display(item,rows_per_page,page){
    page--;
    veriler = item
    let start = rows_per_page * page
    let end = start + Number(rows_per_page)
    let paginatedItems = item.slice(start,end)
    let size = paginatedItems.length + start
    template="";
    for(let i = 0; i < paginatedItems.length; i++)
    {
        tableBody.innerHTML = " ";
        let item = paginatedItems[i]
        let department = item.dept
        template +=`
        <tr class="d-flex pl-5">
        <td class="col-sm-4 col-md-4 col-lg-3">${item.fname} ${item.lname}</td>
        <td class="d-none d-md-block col-md-3">${item.num}</td>
        <td class="d-none d-lg-block col-lg-2 col-xl-3">${depts[department]}</td>
        <td class="col-sm-8 col-md-5 col-lg-4 col-xl-3">
        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#myModal_delete" onclick="deleteItem(${item.id})">Sil</button>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal_update" onclick="updateItem(${item.id})" >Düzenle</button>
        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#myModal_detail" onclick="details(${item.id})">Detay</button>
        </td>
        </tr>
        `
        tableBody.innerHTML+=template
    }
    WhichItemsCurrentlyShown(dataLength,start,size);
}
function pagination(items,rows_per_page){
    
    data = document.getElementById('pagination')
    let page_count = Math.ceil(items.length / rows_per_page)
    data.innerHTML=" ";
    for(let i = 1; i < page_count + 1; i++)
    {
        let btn = PaginationButton(i)
        data.appendChild(btn)
    }
}
function PaginationButton(page){
    let button = document.createElement('button');
    button.innerText=page
    if(currentPage == page) button.classList.add('active')
    button.addEventListener('click',function(){
        currentPage=page
        tableBody.innerHTML = " ";
        display(veriler,rows_per_page,currentPage)
        let current_btn = document.querySelector('.pagenumbers button.active')
        current_btn.classList.remove('active')
        button.classList.add('active')
    });
    return button;
}
function WhichItemsCurrentlyShown(max,first,last)//display number of items in each pagination
{
    let e1 = document.getElementById("max")
    document.getElementById("max").style.fontWeight='bold';
    e1.innerHTML = max
    let e2 = document.getElementById("first")
    document.getElementById("first").style.fontWeight="bold";
    e2.innerHTML = first+1
    let e3 = document.getElementById('last')
    document.getElementById('last').style.fontWeight="bold";
    e3.innerHTML = last
}
function addItem(){
    const form=document.getElementById('form')
    form.addEventListener('submit', function(e){
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData)
        const element = document.getElementById("departman")
        for(let i=1;i<=4;i++)
        {
            if(element.value==depts[i])
            {
                data["dept"]=""+i+"";
                break;
            }
        }
        fetch('http://localhost:3000/students',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(res=>res.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error))
    });
    display(data,rows_per_page,currentPage)

}
window.onload = function listItem(){
    var selectList = document.getElementById("departman");
//Create and append the options
    for (var i = 1; i < 5; i++) {
        selectList.option="";
        var option = document.createElement("option");
        option.value = depts[i];
        option.text = depts[i];
        selectList.appendChild(option);
    }
}
function details(id){
    for(let i = 0; i<veriler.length;i++)
    {
        if(id==veriler[i].id)
        {
            document.getElementById("fname_details").value = veriler[i].fname
            document.getElementById("lname_details").value = veriler[i].lname
            document.getElementById("num_details").value = veriler[i].num
            document.getElementById("dept_details").value = veriler[i].dept
            document.getElementById("pob_details").value = veriler[i].pob
            document.getElementById("dob_details").value = veriler[i].dob
            document.querySelector("button.btn.btn-success").addEventListener("click", function () {
                document.getElementById("myModal_detail").modal('show');      
            });
        }
    }
}
function deleteItem(id)
{
    const element = document.getElementsByClassName("warning")
    for(let i = 0; i<veriler.length;i++)
    {
        if(id==veriler[i].id)
        {
            var index = id
            element[0].innerHTML = "<b>" + veriler[i].fname+" "+ veriler[i].lname + "</b>"
        }
    }
    document.getElementById("deleteId").addEventListener("click", function () {
        fetch(`http://localhost:3000/students/${index}`,{
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>res.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error))
    });
    dataLength--
    display(veriler,rows_per_page,currentPage)
}
function updateItem(id)
{
    for(let i = 0; i<veriler.length;i++){
        if(id==veriler[i].id)
        {   
            var index = id;
            document.getElementById("fname_update").value = veriler[i].fname
            document.getElementById("lname_update").value = veriler[i].lname
            document.getElementById("num_update").value = veriler[i].num
            var selectList = document.getElementById("dept_update");
            let deptId = veriler[i].dept
            //Create and append the options
            for (var k = 1; k < 5; k++) {
                    var option = document.createElement("option");
                    option.value = depts[k];
                    option.text = depts[k];
                    selectList.appendChild(option);
                    if(deptId==k) option.selected=true
                }
            document.getElementById("pob_update").value = veriler[i].pob
            document.getElementById("dob_update").value = veriler[i].dob
            document.querySelector("button.btn.btn-primary").addEventListener("click", function () {
                document.getElementById("#myModal_update").modal('show');      
            });
        }
    }
    const form = document.getElementById("form1")
    form.addEventListener('submit', function(e){
        e.preventDefault();
        const formDatas = new FormData(form);
        var data = Object.fromEntries(formDatas)
        const element = document.getElementById("dept_update")
        for(let i=1;i<=4;i++){
            if(element.value==depts[i])
            {
                data["dept"]=""+i+"";
                break;
            }
        }
        fetch(`http://localhost:3000/students/${index}`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res=>res.json())
            .then(data=>console.log(data))
            .catch(error=>console.log(error))
        });
}
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
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
window.addEventListener('DOMContentLoaded',() =>renderPosts());