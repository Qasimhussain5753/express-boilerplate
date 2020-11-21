const admin = require("firebase-admin");
const serviceAccount = require("../google-services.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

exports.signup = async (req, res, next) => {
  const { user, uid } = req.body;
  if (user === "client") {
    const client = await db.collection("Clients").doc(req.body.uid).get();
    console.log(client.exists);
    if (client.exists) {
      console.log("already");
      res.status(500).send({
        success: false,
        message: "client already exists.",
      });
    } else {
      console.log("Signing up");
      await db
        .collection("Clients")
        .doc(req.body.uid)
        .set({ ...req.body })
        .catch((err) => {
          console.log("Error setting", err);
        });
      res.status(200).send({
        success: true,
        message: "Successfully signed up.",
        data: req.body,
      });
    }
  }
  if (user === "serviceProvider") {
    console.log("serviceProvider");
    const serviceprovider = await db
      .collection("ServiceProvider")
      .doc(req.body.uid)
      .get();
    if (serviceprovider.exists) {
      res.status(500).send({
        success: false,
        message: "Service Provider already exists.",
      });
    } else {
      console.log("Signing up");
      await db
        .collection("ServiceProvider")
        .doc(req.body.uid)
        .set({ ...req.body })
        .catch((err) => {
          console.log("Error setting", err);
        });
      res.status(200).send({
        success: true,
        message: "Successfully signed up.",
        data: req.body,
      });
    }
  }
};

exports.signin = async (req, res, next) => {
  const { uid, fcmToken, user } = req.body;
  if (user === "client") {
    const client = await db.collection("Clients").doc(uid).get();
    if (client.exists) {
      try {
        await db
          .collection("Clients")
          .doc(uid)
          .set({ fcmToken }, { merge: true });
        return res.status(200).send({
          success: true,
          message: "Successfully Login.",
          data: client.data(),
        });
      } catch (error) {
        return res.status(500).send({
          error: "error",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: "client not Found",
      });
    }
  }
  if (user === "serviceProvider") {
    const serviceprovider = await db
      .collection("ServiceProvider")
      .doc(uid)
      .get();
    if (serviceprovider.exists) {
      try {
        await db
          .collection("ServiceProvider")
          .doc(uid)
          .set({ fcmToken }, { merge: true });
        return res.status(200).send({
          success: true,
          message: "Successfully Login.",
          data: serviceprovider.data(),
        });
      } catch (error) {
        return res.status(500).send({
          error: "error",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: "Service Provider not Found",
      });
    }
  }
};

exports.logout = async (req, res, next) => {
  const { uid, user } = req.body;
  if (user === "client") {
    const client = await db.collection("Clients").doc(uid).get();
    if (client.exists) {
      if (client.data().fcmToken === req.body.fcmToken) {
        console.log("fcmToken");
        try {
          await db
            .collection("Clients")
            .doc(uid)
            .set({ fcmToken: "" }, { merge: true });
          return res.status(200).send({
            success: true,
            message: "Logout successfully.",
          });
        } catch (error) {
          return res.status(500).send({
            error: "error",
          });
        }
      } else {
        res.status(200).send({
          success: true,
          message: "Successfully Logout",
        });
      }
    } else {
      res.status(200).send({
        success: true,
        message: "Successfully logout.",
      });
    }
  }
  if (user === "serviceProvider") {
    console.log("fcmToken");
    const serviceprovider = await db.collection("ServiceProvider").doc(uid).get();
    if (serviceprovider.exists) {
      if (serviceprovider.data().fcmToken === req.body.fcmToken) {
       
        try {
          await db
            .collection("ServiceProvider")
            .doc(uid)
            .set({ fcmToken: "" }, { merge: true });
          return res.status(200).send({
            success: true,
            message: "Logout successfully.",
          });
        } catch (error) {
          return res.status(500).send({
            error: "error",
          });
        }
      } else {
        res.status(200).send({
          success: true,
          message: "Successfully Logout",
        });
      }
    } else {
      res.status(200).send({
        success: true,
        message: "Successfully logout.",
      });
    }
  }
};
