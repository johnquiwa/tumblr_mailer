var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var client = tumblr.createClient({
  consumer_key: 'CJYhV1Yo8RGZudb0dkIugNgzmtQKWHHit0BSUCfoeOSq3HSsfK',
  consumer_secret: 'vdT63uQtQSKKwxtrtpRVKFaofsCVkXpYcfKD5h0Rsh3oj2fGJC',
  token: 'KxlWuyp8doEBfAxstA7YuA5NZ6YyvDngrhygedyrNTCRu4QVHy',
  token_secret: '3HPYppmnzKONoy2BHysfSrqQX2QuPa39PfsUcnp8C9WuXGIpiR'
});


var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

var createKeys = function(arr){
    var obj = {};
    for(var i = 0; i <= 3; i++){
        obj[arr[i]] = undefined;
    }
    return obj;
}

function csvParse(csvFile){
    var arr = csvFile.split("\n");
    var parsedArr = [];
    var headerKeys = arr[0].split(',');
    
    for(var i = 1; i < arr.length; i++){
        var personObj = {};
        var personInfo = arr[i].split(',');
        for(var j = 0; j < headerKeys.length; j ++){
            personObj[headerKeys[j]] = personInfo[j];
        }
        parsedArr.push(personObj);
    }
    return parsedArr;
}

function latestPosts(posts){
    var dateToday = Date.now();
    var sevenDays = dateToday - 60480000;
    var recentPosts = [];
    for(var i = 0; i < posts.length; i ++){
              var postDate = Date.parse(posts[i].date);
              if(sevenDays < postDate){
                recentPosts.push([posts[i].post_url,posts[i].title]);   
              }
    }
    return(recentPosts);
}

client.posts('johnquiwacode.tumblr.com', function(err, blog){
 
    var friendsList= csvParse(csvFile);
    var posts = latestPosts(blog.posts);
    var postsUrl = [];
    var postsTitle = [];
    
    for(var i = 0; i < posts.length; i++){
        for(var j = 0; j < posts[i].length; j++){
            if(j == 0){
                postsUrl.push(posts[i][j]);
            }else if (j == 1){
                postsTitle.push(posts[i][j]);
            }
        }
    }
    
    
    friendsList.forEach(function(row){
       var firstName = row["firstName"];
       var numMonthsSinceContact = row["numMonthsSinceContact"];
       
       var templateCopy = emailTemplate;
       
       var customizedTemplate = ejs.render(emailTemplate,
                            { firstName: firstName,
                              numMonthsSinceContact: numMonthsSinceContact,
                              postsUrl: postsUrl,
                              postsTitle: postsTitle    
                            })
                             console.log(customizedTemplate);
    });
    
});





