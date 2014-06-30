
$(document).ready(function(){

  // Disable, Enable submit button
  var validNames = false;
  var nextButton = $("button");

  function fieldValidation(){ 
    $("input[type='text']").keyup(function(){
      // This doesn't catch blank space entries, but it's a simple quick solution.
      var emptyFields = false;
      $("input[type='text']").each(function(){
        if($(this).val() == '') {
          emptyFields = true;
        }
      });
      if (emptyFields) {
        nextButton.attr('disabled', 'disabled');
      } else {
        nextButton.removeAttr('disabled');
        validNames = true;
      }
    });
  }

  // parent form (index.html)
  $('.parent_submit').click(function(){
    if (validNames == false) {
      alert("A full name is required.");
    } else {
      var newFamily = {};
      newFamily.parents = [];
      newFamily.children = [];
      var first_name = $("input[name='first_name']").val();
      var last_name = $("input[name='last_name']").val();

      newFamily.parents.push({
        "first_name":first_name,
        "last_name":last_name,
        "role":""
      });
      storeData(newFamily);
    }
  });

  // children form
  $('#child_select').click(function(){
    $(this).change(function(){
      kidsText();
      kidsFields();
      fieldValidation();
    });
  });

  function kids(){
    var kid = "kid";
    if ($('#child_select')[0][0].selected == true)
      {return kid}
    else
      {return kid + "s"}
  };

  function kidsText(){
    var text = kids();
    $('.kid_span').text(text);
  };

  function kidsFields(){
    var numFields;
    var kidField = "<td><input name='first_name' type='text' placeholder='First Name' onfocus=\"this.placeholder = ''\"></td><td><input name='last_name' type='text' placeholder='Last Name' onfocus=\"this.placeholder = ''\"></td>";
    for (var i = 0; i < 4; i++) {
      if ($('#child_select')[0][i].selected == true)
        {numFields = i}
      $(".kid_name"+i).empty();
    }
    for (var j = 0; j <= numFields; j++) {
      $(".kid_name"+j).html(kidField);
    }
  };

  $('.child_submit').click(function(){
    if (validNames == false) {
      alert("Please fill in required fields.");
    } else {
      var numFields = $("input[name='last_name']").length;
      var family = retrieveData();

      for (var x = 0; x < numFields; x++){
        var first_name = $(".kid_name" + x + " input[name='first_name']").val();
        var last_name = $(".kid_name" + x + " input[name='last_name']").val();
        family.children.push({
          "first_name":first_name,
          "last_name":last_name,
          "role":""
        });
      }
      storeData(family);
    }
  });

  // relationship form
  function getChildren(){
    var default_parent_role, default_child_role;
    var children = retrieveData()['children'];
    var content = "<tr><td colspan='2'>I am <span class='child_name'></span>'s</td></tr><tr><td colspan='2'><input name='parent_role' type='text' placeholder='Mom / Dad' onfocus=\"this.placeholder = ''\"></td></tr><tr><td colspan='2'><span class='child_name'></span> is my</td></tr><tr><td colspan='2'><input name='child_role' type='text' placeholder='Daughter / Son' onfocus=\"this.placeholder = ''\"></td></tr>"
    for (var x=0; x < children.length;x++){
      $(".kid_role" + x).html(content);
      $('.kid_role' + x + ' span.child_name').each(function(){
        $(this).text(children[x]['first_name'])
      });
    }

    $("#default_role input").keyup(function(){
      default_parent_role = $("#default_role input[name='parent_role']").val()
      default_child_role = $("#default_role input[name='child_role']").val()
      defaultRole(default_parent_role,default_child_role);
    });

    fieldValidation();
  }

  function defaultRole(parent, child){
    $('.prefill').each(function(){
      $(".prefill input[name='parent_role']").val(parent);
      $(".prefill input[name='child_role']").val(child);
    });
  }

  $('.role_submit').click(function(){
    if (validNames == false) {
      alert("Please fill in required fields.");
    } else {
      var family = retrieveData();

      for (var x = 0; x < family.parents.length; x++){
        family.parents[x]['role'] = $(".kid_role" + x + " input[name='parent_role']").val();
      }

      for (var x = 0; x < family.children.length; x++){
        var parent_role = $(".kid_role" + x + " input[name='parent_role']").val();
        var child_role  = $(".kid_role" + x + " input[name='child_role']").val();
        if (parent_role.toLowerCase() == "dad" || parent_role.toLowerCase() == "father") {
          family.children[x].dad = family.parents[0].first_name;
        } else {
          family.children[x].mom = family.parents[0].first_name;
        }
        family.children[x]['role'] = child_role;
      }
      storeData(family);
    }
  });

  // other parent form
  function otherParents(){
    var children = retrieveData()['children'];
    var content = "<tr><td colspan='2'><span class='child_name'></span> has a</td></tr><tr><td colspan='2'><input name='parent_role' type='text' placeholder='Mom / Dad' onfocus=\"this.placeholder = ''\"></td></tr><tr><td colspan='2'>named</td></tr><tr><td><input name='first_name' type='text' placeholder='First Name' onfocus=\"this.placeholder = ''\"></td><td><input name='last_name' type='text' placeholder='Last Name' onfocus=\"this.placeholder = ''\"></td></tr>"
    for (var x=0; x < children.length;x++){
      $(".parent_role" + x).html(content);
      $('.parent_role' + x + ' span.child_name').each(function(){
        $(this).text(children[x]['first_name'])
      });
    }

    $("#default_role input").keyup(function(){
      default_parent_role = $("#default_role input[name='parent_role']").val();
      default_first_name = $("#default_role input[name='first_name']").val();
      default_last_name = $("#default_role input[name='last_name']").val();
      defaultParent(default_parent_role,default_first_name,default_last_name);
    });

    fieldValidation();
  }

  function defaultParent(parent, first, last){
    $('.prefill').each(function(){
      $(".prefill input[name='parent_role']").val(parent);
      $(".prefill input[name='first_name']").val(first);
      $(".prefill input[name='last_name']").val(last);
    });
  }

  $('.other_parent_submit').click(function(){
    if (validNames == false) {
      alert("Please fill in required fields.");
    } else {
      var family = retrieveData();

      for (var x = 0; x < family.children.length; x++){
        var parent_role = $(".parent_role" + x + " input[name='parent_role']").val();
        var first_name = $(".parent_role" + x + " input[name='first_name']").val();
        var last_name = $(".parent_role" + x + " input[name='last_name']").val();
        var child = $('.parent_role' + x + ' span.child_name').text()
        var obj = search(first_name, family.parents);

        if (parent_role.toLowerCase() == "dad" || parent_role.toLowerCase() == "father") {
          family.children[x].dad = first_name;
          family.children[x].mom = family.parents[0].first_name;
        } else {
          family.children[x].mom = first_name;
          family.children[x].dad = family.parents[0].first_name;
        }

        if (obj == undefined) {
          // create new parent
          family.parents.push({
            "first_name":first_name,
            "last_name":last_name,
            "role":parent_role
          });
        }
      }
      storeData(family);
    }
  });


  // final page
  function getFamily() {
    var family = retrieveData();
    
    for (var y = 0;y < family.children.length; y++){
      var person = family.children[y];
      var father = getParent(person.dad);
      var mother = getParent(person.mom);
      var father_name = father.first_name +" "+ father.last_name;
      var mother_name = mother.first_name +" "+ mother.last_name;
      $('.family').append("<tr><td class='member child" + y + "'></td></tr>");
      $(".child"+y).html(person.first_name +" "+ person.last_name);
      if (father) {
        $(".child"+y).append("<div class='others'>"+father_name+" - "+father.role+"</div>");
      }
      if (mother) {
        $(".child"+y).append("<div class='others'>"+mother_name+" - "+mother.role+"</div>");
      }
    };

    for (var i = 0; i < family.parents.length; i++) {
      var person = family.parents[i];
      var kids = getKids(person.first_name);
      $('.family').append("<tr><td class='member parent" + i + "'></td></tr>");
      $(".parent"+i).html(person.first_name +" "+ person.last_name);

      for (var x=0; x < kids.length; x++){
        var name = kids[x].first_name+" "+kids[x].last_name+" - "+kids[x].role;
        $(".parent"+i).append("<div class='others'>"+name+"</div>");
      }
    };
  }

  function getParent(first_name){
    var parents = retrieveData()['parents'];
    for (var i=0; i < parents.length; i++){
      if (parents[i].first_name == first_name) {
        return parents[i];
      }
    }
    return false;
  }

  function getKids(parent_name){
    var children = retrieveData()['children'];
    var legit_kids = [];
    for (var i=0; i< children.length; i++){
      if (children[i].dad == parent_name || children[i].mom == parent_name)
        { legit_kids.push(children[i]); }
    }
    return legit_kids;
  }

  $(".clear").click(function(){
    localStorage.clear();
  });

  // store and retrieve data from localStorage
  function storeData(data){
    localStorage.data = JSON.stringify(data);
  }

  function retrieveData(){
    return JSON.parse(localStorage.data);
  }

  function search(first_name, myArray){
    for (var i=0; i < myArray.length; i++) {
      if (myArray[i].first_name == first_name) {
        return myArray[i];
      }
    }
  }


  fieldValidation();
  getChildren();
  otherParents();
  getFamily();
});
