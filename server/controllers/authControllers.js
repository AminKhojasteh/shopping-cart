import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import verificationCodeGenerator from "../utilities/verificationCodeGenerator.js";
import verificationCodeExpirationTime from "../utilities/verificationCodeExpirationTime.js";

export const signup = async function (req, res) {
  try {
    const recievedData = req.body;
    if (!recievedData) {
      throw new Error("لطفا تمام ورودی‌ها را وارد نمایید");
    }
    if (!recievedData.email || !recievedData.password || !recievedData.name) {
      throw new Error("لطفا تمام ورودی‌ها را وارد نمایید");
    }
    const { email, password, name } = recievedData;
    if (!validator.isEmail(email)) {
      throw new Error("لطفا یک ایمیل معتبر وارد نمایید");
    }
    if (!validator.isLength(password, { min: 6 })) {
      throw new Error("رمز عبور حداقل باید شش کاراکتر باشد");
    }
    const isUserIsAlreadyExists = await userModel.findOne({ email });
    if (isUserIsAlreadyExists && isUserIsAlreadyExists.isVerified) {
      throw new Error("این کاربر قبلا ثبت نام کرده است");
    }
    let savedNewUser;
    if (isUserIsAlreadyExists && !isUserIsAlreadyExists.isVerified) {
      savedNewUser = await userModel.findOneAndUpdate(
        { email },
        {
          password: await bcrypt.hash(password, 10),
          name,
          verificationCode: verificationCodeGenerator(),
          verificationCodeExpiresAt: verificationCodeExpirationTime(),
        },
        { new: true }
      );
    }
    if (!isUserIsAlreadyExists) {
      savedNewUser = await userModel.create({
        email,
        password: await bcrypt.hash(password, 10),
        name,
        verificationCode: verificationCodeGenerator(),
        verificationCodeExpiresAt: verificationCodeExpirationTime(),
      });
    }

    //
    // sending an email with verification code to new user email address
    //

    res.status(201).json({
      success: true,
      message: "کدی به ایمیل شما ارسال شد",
      verificationCode: savedNewUser.verificationCode,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async function (req, res) {
  try {
    const recievedData = req.body;
    if (!recievedData) {
      throw new Error("لطفا هر دو ورودی را وارد نمایید");
    }
    if (!recievedData.email || !recievedData.password) {
      throw new Error("لطفا هر دو ورودی را وارد نمایید");
    }
    const { email, password } = recievedData;
    const user = await userModel.findOne({ email, isVerified: true });
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "ایمیل یا رمز عبور اشتباه است." });
    }
    if (user) {
      const arePasswordsMatch = await bcrypt.compare(password, user.password);
      if (!arePasswordsMatch) {
        res
          .status(401)
          .json({ success: false, message: "رمز عبور اشتباه است." });
      }
      if (arePasswordsMatch) {
        //
        // sending JWT as a cookie
        //

        res.status(200).json({ success: true, message: "خوش آمدید" });
      }
    }
    // res.status(200).json({ success: true, message: user.name });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async function (req, res) {
  res.send("logout route");
};
