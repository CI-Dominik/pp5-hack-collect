import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import Hack from "./Hack";
import Asset from "../../components/Asset";

import styles from "../../styles/HackList.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

function HackList({ message, filter = "" }) {
  const [hacks, setHacks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosReq.get("/categories/");
        setCategories(data.results);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchHacks = async () => {
      try {
        const { data } = await axiosReq.get(
          `/hacks/?${categoryFilter ? `category__name=${categoryFilter}&` : ""}${filter}search=${query}`
        );
        setHacks(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchHacks();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, categoryFilter]);

  const handleCategoryClick = (categoryName) => {
    setCategoryFilter((prev) =>
      prev === categoryName ? "" : categoryName
    );
  };

  return (
    <Container>
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={8}>
          <div className="mb-3 d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={categoryFilter === cat.name ? "primary" : "outline-primary"}
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <i className={`fas fa-search ${styles.SearchIcon}`} />
            <Form
              className={`w-100 ${styles.SearchBar}`}
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                className="mr-sm-2"
                placeholder="Search hacks"
              />
            </Form>
          </div>

          {hasLoaded ? (
            <>
              {hacks.results.length ? (
                <InfiniteScroll
                  children={hacks.results.map((hack) => (
                    <Hack key={hack.id} {...hack} setHacks={setHacks} />
                  ))}
                  dataLength={hacks.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!hacks.next}
                  next={() => fetchMoreData(hacks, setHacks)}
                />
              ) : (
                <Container>
                  <h1 className="text-white fw-bold">No results found.</h1>
                </Container>
              )}
            </>
          ) : (
            <Container>
              <Asset spinner />
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HackList;