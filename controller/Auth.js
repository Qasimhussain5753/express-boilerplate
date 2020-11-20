const admin = require("firebase-admin");
const serviceAccount = require("../google-services.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

exports.signup = async (req, res, next) => {
  console.log(req.body);
  const user = await db.collection("Users").doc(req.body.uid).get();
  console.log(user.exists);
  if (user.exists) {
    console.log("already");
    res.status(500).send({
      success: false,
      message: "User already exists.",
    });
  } else {
    console.log("Signing up");
    await db
      .collection("Users")
      .doc(req.body.uid)
      .set({ ...req.body })
      .then((r) => {})
      .catch((err) => {
        console.log("Error setting", err);
      });
    res.status(200).send({
      success: true,
      message: "Successfully signed up.",
      data: req.body,
    });
  }
};

exports.signin = async (req, res, next) => {
  const { uid, fcmToken } = req.body;
  const user = await db.collection("Users").doc(uid).get();

  if (user.exists) {
    try {
      await db.collection("Users").doc(uid).set({ fcmToken }, { merge: true });
      return res.status(200).send({
        success: true,
        message: "Successfully Login.",
        data: user.data(),
      });
    } catch (error) {
      return res.status(500).send({
        error: "error",
      });
    }
  } else {
    res.status(500).send({
      success: false,
      message: "User not Found",
    });
  }
};

exports.logout = async (req,res, next) =>{
  const { uid } = req.body;
 const user = await db.collection("Users").doc(uid).get();
 
   if(user.data().fcmToken === req.body.fcmToken){
       try {
           await db.collection("Users").doc(uid).set({fcmToken: ""}, {merge: true});
           return res.status(200).send({
               success: true,
               message: "Logout successfully.",
            })
        }
        catch(error){
            return res.status(500).send({
                error: "error"
            })
        }
   }
   else {
       res.status(200).send({
           success: true,
           message: "Successfully Logout"
       })
   }
}