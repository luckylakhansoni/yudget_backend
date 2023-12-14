const dbConfig = require("../config/db.config.js");
const {emailsend} = require('./helper')


module.exports.signup = async(f_name, l_name, user, jwt, email, password)=> {
  try {
    let signUp = `<!DOCTYPE html>
    <html>
    <head>
        <title></title>
    </head>
    <body>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Welcome&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${f_name} ${l_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p><br></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Your registration has been successfully done!</span></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Please&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}/dashboard/profile/${jwt}/${user.credit}/${user.isApproved}/false/true">Click here</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">to complete your information so that we can review and grant you access to Yudget platform.</span></p>
        <p><br></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#ff0000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">User: ${email}</span></p>
        <p><br></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#ff0000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password: ${password}</span></p>
        <p><br></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">أهلا بك&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${l_name} ${f_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تم تسجيلك بنجاح!</span></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">يرجى&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}/dashboard/profile/${jwt}/${user.credit}/${user.isApproved}/false/true">الضغط هنا</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;لإكمال معلوماتك حتى نتمكن من مراجعتها وتفعيل حسابك بشكل كامل في منصة يودجت.</span></p>
          <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#ff0000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">اسم المستخدم: ${email}</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#ff0000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">كلمة المرور: </span><span dir="ltr" style="font-size:12pt;font-family:Calibri,sans-serif;color:#ff0000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${password}</span></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    </body>
    </html>`
    let object = {
        to: user.email,
        subject: "مستخدم تسج - User Registration",
        // text: `,
        html: signUp
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}

module.exports.forget = async(newOtp, emailAddress)=> {
  try {
    let htmlData = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p>Your one-time password is: ${newOtp}<p>
    <p>
    <p dir="rtl">كلمة مرورك لمرة واحدة هي : ${newOtp}<p>
    </body>
    </html>`
    let object = {
      to: emailAddress,
      subject: "إستعادة كلمة المرور - Forgot Password",
      // text: `${newOtp} كلمة مرورك لمرة واحدة هي`,
      html:htmlData
    };
    await emailsend(object)
    
  } catch (error) {
    throw error
  }
}

module.exports.Support = async(name, contact_id, email)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
      <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">We received your request!</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Your ticket number is:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">TICK12</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">We will revert to you shortly.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">لقد تلقينا طلبك!</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">رقم تذكرتك هو:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">TICK${contact_id}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">سنعود إليك قريبًا.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    
    </body>
    </html>`
    let object = {
      to: email,
      subject: "فريق الدعم - Support Team",
      // text: `,
       html: data
    };
    await emailsend(object)    
  } catch (error) {
    throw error
  }
}

module.exports.newBranch = async(branch_manager, branch_name, email, beforePassword)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
      <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branch_manager}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">New account has been created for branch&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branch_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;on Yudget platform.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Please find the login details below:</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Email :&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${email}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password :&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${beforePassword}</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Log in to your Yudget account&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3054/#">here</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branch_manager}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تم إنشاء حساب جديد لفرع&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branch_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;على منصة يودجت.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تفاصيل تسجيل الدخول أدناه:</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">البريد الإلكتروني:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${email}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">كلمة المرور:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${beforePassword}</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">سجل دخولك إلى حساب يودجت من&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3054/#">هنا</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    
    </body>
    </html>`
    let object = {
      to: email,
      subject: "تم إنشاء فرع جديد - New Branch Created",
      // text: `,
       html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}

module.exports.UpdateBranch = async(getBranch, email)=> {
  try {
    if(getBranch && getBranch.branch_manager && getBranch.branch_name && email) {
      let data = `<!DOCTYPE html>
      <html>
      <head>
        <title></title>
      </head>
      <body>
      <p>Dear ${getBranch.branch_manager}<p>
      <p>You have successfully changed email address<p>
      <p>Find details:<p>
      <p>Dear ${getBranch.branch_manager}<p>
      <p>Log in to your Yodget account from here<p>
      <p>${dbConfig.HOST}:3054/#<p>
      <p>Yudget Team.<p>

      
      <p dir = "rtl">تي/عزيزي ${getBranch.branch_manager}<p>
      <p dir = "rtl">لقد نجحت في تغيير عنوان البريد الإلكتروني<p>
      <p dir = "rtl">تفاصيل تسجيل الدخول أدناه:<p>
      <p dir = "rtl">ابحث عن التفاصيل : ${email}<p>
      <p dir = "rtl">سجل دخولك إلى حساب يودجت من هنا.<p>
      <p dir = "rtl">${dbConfig.HOST}:3054/#<p>
      <p dir = "rtl">فريق عمل يودجت.<p>
      </body>
      </html>`
      let object = {
        to: email,
        subject: "جديد فرع إنشاء تم",
        // text: `,
         html: data
      };
      await emailsend(object)
    }
  } catch (error) {
    throw error
  }
}


module.exports.creditForBranch = async(branchObject,amount)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branchObject.branch_manager}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p><br></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Credit added to branch&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branchObject.branch_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;account with amount:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${amount}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;SR</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branchObject.branch_manager}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تم &nbsp;اضافة رصيد إلى حساب فرع&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${branchObject.branch_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;قدره :&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${amount}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp; ر.س</span></p>
    </body>
    </body>
    </html>`
    let object = {
      to: branchObject.email,
      subject: "استلام رصيد - Credit Received",
      // text: `,
       html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}


module.exports.allEmployee = async(empDetail,email)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Welcome&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.f_name} ${empDetail.l_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Please find your code below:</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Employee code:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.emp_code}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Email address:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.email}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Mobile number:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.mobile}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">أهلاً بك &nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.l_name} ${empDetail.f_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">الرجاء العثور على الرمز الخاص بك أدناه:</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">رمز الموظف:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.emp_code}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">البريد الإلكتروني:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.email}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">رقم الجوال:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${empDetail.mobile}</span></p>
    
    </body>
    </html>`
    let object = {
      to: email,
      subject: "رمز يودجت الخاص بك - Your Yudget’s Code",
      // text: `,
      html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}

module.exports.accountApproved = async(userObj)=> {
  try { 
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Welcome&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${userObj.f_name} ${userObj.l_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Glad to inform you that your account on Yudget platform has been successfully activated.</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Log in to your Yudget account&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3054">here</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">أهلا بك&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${userObj.l_name} ${userObj.f_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">يسعدني إخبارك بأنه قد تم تفعيل حسابك على منصة يودجت بنجاح.</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">سجل دخولك إلى حساب يودجت من&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3054">نا</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    </body>
    </html>`
    let object = {
      to: userObj.email,
      subject: "تم تفعيل الحساب بنجاح - Account Successfully Activated",
      // text: `,
      html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}


module.exports.newGasStation = async(body, station, plainPassword, SuperVisorPassword)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.supervisor_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Gas station&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.station_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;has been added to Yudget network.</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Please find below Log in details:</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Station&rsquo;s Employees:</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">User:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${station.station_id}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${plainPassword}</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Station&rsquo;s Supervisor:</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">User:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${body.email}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${SuperVisorPassword}</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.supervisor_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">يسعدني إخبارك بأنه تم ضم محطة&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.station_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;إلى شبكة يودجت.</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تفاصيل تسجيل الدخول أدناه:</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">موظفين المحطة:</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">اسم المستخدم:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${station.station_id}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">كلمة المرور:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${plainPassword}</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">مشرف المحطة:</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">اسم المستخدم:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.email}</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">كلمة المرور:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${SuperVisorPassword}</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    </body>
    </html>`
      let object = {
        to: body.email,
        subject: "تم إضافة محطة جديدة - New Gas Station Added",
        // text: `,
          html: data
      };
      await emailsend(object)
  } catch (error) {
    throw error
  }
}
module.exports.updateGasStation = async(body, station, plainPassword, SuperVisorPassword)=>{
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.supervisor_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Gas station&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.station_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp; password has been updated by the admin.</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Please find below Log in details:</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Station&rsquo;s Employees:</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">User:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${station.station_id}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${plainPassword}</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Station&rsquo;s Supervisor:</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">User:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${body.email}</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;${SuperVisorPassword}</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p><br></p>

    </body>
    </html>`
    let object = {
      to: body.email,
      subject: "تم تحديث كلمة مرور محطة الوقود - Gas Station password updated",
      // text: `,
        html: data
    };
    await emailsend(object)
  } catch (error) {
    console.log({error})
  }
}


module.exports.newGasComapany = async(body)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Welcome!</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Thank you for joining Yudget network, you are officially ready to grow and expand with us.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Coming together is a beginning, keeping together is progress, working together is success.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">أهلاً بك!</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">شكراً لإنضمامكم إلى شبكة يودجت، رسمياً أنت الآن جاهز للتوسع والنمو معنا.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">إن التلاقي معًا هو البداية ، والبقاء معًا هو التقدم ، والعمل معًا هو النجاح.&nbsp;</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    </body>
    </html>`
    let object = {
      to: body.email,
      subject: "أهلاً بك معنا - Welcome With Us",
      // text: `,
       html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}


module.exports.creditTransferByAdmin = async(body, userD)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${userD.f_name} ${userD.l_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Credit added to your account with amount:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.amount}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;SR</span></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Log in to your Yudget account&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3054/#">here</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-git family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${userD.l_name} ${userD.f_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تمت اضافة رصيد إلى حسابكم بمبلغ قدره :&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${body.amount}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp; ر.س</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">سجل دخولك إلى حساب يودجت من&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3054/#">نا</a>ه</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    </body>
    </html>`
    let object = {
      to: userD.email,
      subject: "تم إضافة رصيد بنجاح - Credit added Successfully",
      // text: `,
        html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}


module.exports.paymentByAdmin = async(getPath, companyDetails)=> {
  try {
    let path = getPath.receipt.split('/')
      let data = `<!DOCTYPE html>
      <html>
      <head>
        <title></title>
      </head>
      <body>
      <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${companyDetails.f_name} ${companyDetails.l_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
      <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Reference:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${getPath.payment_id}</span></p>
      <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Amount transferred:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${getPath.due_amount}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;SR</span></p>
      <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Please&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3055/pdf/${path[2]}">click here</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;to download the reference</span></p>
      <p><br></p>
      <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Yudget Team</span></p>
      <p><br></p>
      <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي &nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${companyDetails.l_name} ${companyDetails.f_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
      <p><br></p>
      <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">الرقم المرجعي:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${getPath.payment_id}</span></p>
      <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تم تحويل مبلغ:</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${getPath.due_amount}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp; ر.س</span></p>
      <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">يرجى&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><a href="http://${dbConfig.HOST}:3055/pdf/${path[2]}">الضغط هنا</a></span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#2e75b5;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">للإطلاع على وثيقة التحويل.</span></p>
      <p><br></p>
      <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
      </body>
      </html>`
      let object = {
        to: companyDetails.email,
        subject: "اشعار تحويل مالي - Remittance Advice",
         html: data
      };
      await emailsend(object)
  } catch (error) {
    throw error
  }
}

module.exports.monthlyInvoice = async(userD, month, obj)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
    <title></title>
    </head>
    <body>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${userD.f_name} ${userD.l_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><br></p>
        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${month}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">&nbsp;invoice has been released.</span></p>
        <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Invoice number:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">INV${obj.invoice_id}</span></p>
        <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.Yudget Team</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي &nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${userD.l_name} ${userD.f_name}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p><br></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تم اصدار فاتورة شهر&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${month}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">رقم الفاتورة:&nbsp;</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:#c0c0c0;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">INV${obj.invoice_id}</span><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.</span></p>
        <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
        </body>
    </html>`
      let object = {
        to: userD.email,
        subject: "الفاتورة الشهرية - Monthly Invoice",
        // text: `,
         html: data
      };
      await emailsend(object)
  } catch (error) {
    throw error
  }
}


module.exports.helpDesk = async(stationInfo)=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">,Dear Station</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Your query is successfully raised</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">We will contact you soon</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">.Yudget Team</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">عزيزي/تي .&nbsp;</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">تم رفع استفسارك بنجاح!</span></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">وسوف نتصل بك قريبًا.</span></p>
    <p><br></p>
    <p dir="rtl" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:12pt;font-family:Calibri,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">فريق عمل يودجت.</span></p>
    </body>
    </html>`
    let object = {
      to: stationInfo.email,
      subject: "مكتب المساعدة - Help Desk",
      // text: `,
      html: data
    };
    await emailsend(object)
  } catch (error) {
    throw error
  }
}


module.exports.test = async()=> {
  try {
    let data = `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <p>Dear test<p>
    <p>Gas station test has been added to Yudget network.<p>
    <p>Please find below Log in details:<p>
    <p>
    <p>Station’s Employees:<p>
    <p>User: test<p>
    <p>Password: test<p>
    <p>
    <p>Station’s Supervisor:<p>
    <p>User: test<p>
    <p>Password: test<p>
    <p>
    <p>Yudget Team.<p>



      <p dir = "rtl">تي/عزيزي test</p>
      <p dir = "rtl">لى شبكة يودجت. test يسعدني إخبارك بأنه تم ضم محطة</p>
      <p dir = "rtl">: موظفين المحطة<p>
      <p dir = "rtl">المستخدم اسم : test<p>
      <p dir = "rtl">المرور كلمة : test<p>
      <p dir = "rtl">:مشرف المحطة<p>
      <p dir = "rtl">اسم المستخدم : test<p>
      <p dir = "rtl">اسم المستخدم : test<p>
      <p dir = "rtl">فريق عمل يودجت.<p>
        </body>
    </html>`
  let object = {
    to: 'lakhan@yopmail.com',
    subject: "تم إنشاء فرع جديد - New Branch Created",
    // text: `,
     html: data
  };
  await emailsend(object)
  } catch (error) {
    throw error
  }
}