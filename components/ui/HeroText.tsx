"use client";
import Image from "next/image";
import React from "react";
import { delay, motion } from "framer-motion";
import { div } from "framer-motion/client";

export default function HeroText({ name }: { name: string | undefined }) {
  return (
    <div>
      <div className=" text-center flex items-center">
        <Image
          src={name ? `/profile.jpg` : "/profile.png"}
          alt="Profile"
          width={120}
          height={120}
          className="mx-auto rounded-full mb-5"
        />
      </div>
      <div>
        {name ? (
          <div>
            <motion.h1
              className="text-5xl font-mono text-white font-extrabold transition-all "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Hello, {name}
            </motion.h1>
            <motion.p
              className="text-center text-white font-inter mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              How's it going?
            </motion.p>
          </div>
        ) : (
          <div>
            <motion.h1
              className="text-5xl font-mono text-white font-extrabold transition-all "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Hello, Guest
            </motion.h1>
            <motion.p
              className="text-center text-white font-inter mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              Please create a account.
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}
