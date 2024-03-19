import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchSingleGameQuery } from "../../redux/services/gameApi";
import { showError } from "../../utils/Alert";
import Loader from "../../utils/Loader";

const ViewSingleGame = () => {
  const { gid } = useParams();
  const navigate = useNavigate();

  const { data: game, isLoading, isSuccess } = useFetchSingleGameQuery(gid);

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        navigate("/dashboard/lotteries/view-game?hideBackBtn=true", {
          state: { game: game?.game },
        });
      } else {
        showError("Could not fetch game");
        navigate("/dashboard");
      }
    }
  }, [isLoading, isSuccess, navigate, game]);

  return (
    <>
      <Loader isLoading={true} height={"60vh"} variety={"dark"} />
    </>
  );
};

export default ViewSingleGame;
