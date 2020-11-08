import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        height: "100vh",
        backgroundColor: "#4a44eb",
    }
}),
);


export default function GreetingView({GreetingComp} : {
    GreetingComp: React.ReactElement
}
) {
    const classes = useStyles();
    return (
        <Grid
        container
        className={classes.root}
        direction="column"
        justify="center"
        alignItems="center">
            {GreetingComp}
        </Grid>
    );
};