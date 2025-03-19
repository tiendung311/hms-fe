"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import CustomerHeader from "../components/CustomerHeader";
import Intro from "../components/home/Intro";
import About from "../components/home/About";
import Footer from "../components/Footer";
import ShowRoom from "../components/home/ShowRoom";

export default function Home() {
  return (
    <>
      <Container>
        <CustomerHeader />
        <Intro />
        <About />
        <ShowRoom />
      </Container>
      <Footer />
    </>
  );
}
