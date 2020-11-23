

exports.signup = async (req, res, next) => {
  const { userType, uid } = req.body;
  if (userType === "client") {
    const client = await req.db.collection("Clients").doc(req.body.uid).get();
    console.log(client.exists);
    if (client.exists) {
      console.log("already");
      return res.status(500).send({
        success: false,
        message: "User already exists.",
      });
    } else {
      console.log("Signing up");
      await req.db
        .collection("Clients")
        .doc(req.body.uid)
        .set({ ...req.body })
        return res.status(200).send({
        success: true,
        message: "Successfully signed up.",
        data: req.body,
      });
    }
  }
  if (userType === "serviceProvider") {
    console.log("serviceProvider");
    const serviceprovider = await req.db
      .collection("ServiceProvider")
      .doc(req.body.uid)
      .get();
    if (serviceprovider.exists) {
      console.log("already exist ")
      return res.status(400).send({
        success: false,
        message: "User already exists.",
      });
    } else {
      console.log("Signing up");
      await req.db
        .collection("ServiceProvider")
        .doc(req.body.uid)
        .set({ ...req.body })
        .catch((err) => {
          console.log("Error setting", err);
        });
        return res.status(200).send({
        success: true,
        message: "Successfully signed up."
      });
    }
  }
  else {
    return res.status(500).send({
      success: false,
      message: "No user type specified"
    })
  }
};

exports.signin = async (req, res, next) => {
  const { uid, fcmToken, userType } = req.body;
  if (userType === "client") {
    console.log("client")
    const client = await req.db.collection("Clients").doc(uid).get();
    if (client.exists) {
      try {
        await req.db
          .collection("Clients")
          .doc(uid)
          .set({ fcmToken }, { merge: true });
        return res.status(200).send({
          success: true,
          message: "Successfully Login.",
          data: client.data(),
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error"
        })
      }
    } else {
      return  res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
  }
  if (userType === "serviceProvider") {
    const serviceprovider = await req.db
      .collection("ServiceProvider")
      .doc(uid)
      .get();
    if (serviceprovider.exists) {
      try {
        await req.db
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
      return res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
  }
};

exports.logout = async (req, res, next) => {
  const { uid, userType } = req.body;
  if (userType === "client") {
    const client = await db.collection("Clients").doc(uid).get();
    if (client.exists) {
      if (client.data().fcmToken === req.body.fcmToken) {
        console.log("fcmToken");
        try {
          await req.db
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
        return res.status(200).send({
          success: true,
          message: "Successfully Logout",
        });
      }
    } else {
      return res.status(200).send({
        success: true,
        message: "Successfully logout.",
      });
    }
  }
  if (userType === "serviceProvider") {
    console.log("fcmToken");
    const serviceprovider = await req.db.collection("ServiceProvider").doc(uid).get();
    if (serviceprovider.exists) {
      if (serviceprovider.data().fcmToken === req.body.fcmToken) {
       
        try {
          await req.db
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
        return res.status(200).send({
          success: true,
          message: "Successfully Logout",
        });
      }
    } else {
      return res.status(200).send({
        success: true,
        message: "Successfully logout.",
      });
    }
  }
};
