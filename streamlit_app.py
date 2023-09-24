import random
import requests
import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
from bokeh.plotting import figure


#Whole page edit
st.set_page_config(
    page_title="Capycode_Metrics",
    page_icon="",
    layout="wide",
    initial_sidebar_state="collapsed",
    
)
response = requests.get("https://socket-capycode-97b8bfffeda4.herokuapp.com/api/applicants/applicant_18")
jres = response.json()
logic = 0
logicbyTime = []
syntaxbyTime = []
syntax = 0
score = 0
errors = []
timer = []

for key in jres:
    logic = logic + key["logicCount"]
    syntax = syntax +key["syntaxCount"]
    logicbyTime.append(logic)
    syntaxbyTime.append(syntax)
    errors.append(logic+syntax)
    ti = key["timeFrame"].replace("T"," ").replace("Z"," ")
    ti= ti[:-5]
    t =datetime.strptime(ti,"%Y-%m-%d %H:%M:%S")
    timer.append(t)


#cuando se tengan varios argumentos con mismo header
#jres[numero de argumento][header]

results= (logic + syntax)/100
if results < 1:
    score = 100
elif results > 1 and results < 2:
    score = 90
elif results > 2 and results < 3:
    score = 80
elif results > 3 and results < 4:
    score = 70
elif results > 4 and results < 5:
    score = 60
elif results > 5 and results < 6:
    score = 50
elif results > 6 and results < 7:
    score = 40
elif results > 7 and results < 8:
    score = 30
elif results > 8 and results < 9:
    score = 20
elif results > 9 and results < 10:
    score = 00

col1,mid,col2 = st.columns([1,1,20])



#DATAFRAME
df = pd.DataFrame(
    {
        "Logic Errors": [logic],
        "Syntax Erros": [syntax],
        "Score": [score],
        "URL": ["www.github.com"],
    }
)

feedback = requests.get("https://socket-capycode-97b8bfffeda4.herokuapp.com/api/applicants/feedback/applicant_18")
feedres = feedback.json()

with col1:
    st.image("https://cdn-icons-png.flaticon.com/512/235/235359.png", width=100)
with col2:
    st.title("Capycode Metrics")

space,col3,space = st.columns([40,10,40])

with col3:
    st.header('Juan Aispuro')

space,col7,space3 = st.columns(3)
with space:
    col1,col2,col3 = st.columns(3)
    with col1:
        st.write('')
    with col2:
        st.subheader("Information")
    with col3:
        st.write('')
    st.dataframe(
    df,
    hide_index=True,
    use_container_width=True
    )
with space3:
    st.subheader("Last Feedback Received")
    st.write(feedres)

#CHART OF ERRRORS
chart_data = pd.DataFrame(
   {
       "# of errors": errors,
       "Time": timer,
   }
)

space2,col4,space2 = st.columns([30,5,30])
with col4:
    st.header("Overall Errors")
st.line_chart(chart_data, x="Time", y="# of errors",color="#DE2A1D")

#Lines per Second and Grammar errors
lines=[10,15,25,40]
Time=[30,90,150,200]
p = figure(
    x_axis_label='Time',
    y_axis_label='Lines in Code')

p.line(Time, lines, legend_label='# of lines', line_width=2)

#Types of error in code


chart_data_syntax = pd.DataFrame(
   {
       "# of errors": syntaxbyTime,
       "Time": timer,
   }
)
chart_data_logic = pd.DataFrame(
   {
       "# of errors": logicbyTime,
       "Time": timer,
   }
)

col5,col6 = st.columns([50,50])
with col5:
    col1,col2,col3 = st.columns(3)
    with col1:
        st.write('')
    with col2:
        st.subheader("Logic Errors")
    with col3:
        st.write('')
    st.line_chart(chart_data_logic,x="Time",y="# of errors",color="#911B13")
with col6:
    col1,col2,col3 = st.columns(3)
    with col1:
        st.write('')
    with col2:
        st.subheader("Syntax Errors")
    with col3:
        st.write('')
    st.line_chart(chart_data_syntax,x="Time",y="# of errors",color="#849113")    
