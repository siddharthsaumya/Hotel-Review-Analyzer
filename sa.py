import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.metrics import confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import string
import re
import numpy as np
import warnings
import sys

warnings.filterwarnings('ignore')
Reviewdata = pd.read_csv(
    r'C:\Users\KIIT\Desktop\nlpminiproject\public\train.csv')


def text_clean_1(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text


def cleaned1(x): return text_clean_1(x)


Reviewdata['cleaned_description'] = pd.DataFrame(
    Reviewdata.Description.apply(cleaned1))


def text_clean_2(text):
    text = re.sub('[‘’“”…]', '', text)
    text = re.sub('\n', '', text)
    return text


def cleaned2(x): return text_clean_2(x)


Reviewdata['cleaned_description_new'] = pd.DataFrame(
    Reviewdata['cleaned_description'].apply(cleaned2))
Independent_var = Reviewdata.cleaned_description_new
Dependent_var = Reviewdata.Is_Response
IV_train, IV_test, DV_train, DV_test = train_test_split(
Independent_var, Dependent_var, test_size=0.1, random_state=225)
tvec = TfidfVectorizer()
clf2 = LogisticRegression(solver= "lbfgs")
model = Pipeline([('vectorizer', tvec),('classifier',clf2)])
model.fit(IV_train, DV_train)
predictions = model.predict(IV_test)
confusion_matrix(predictions, DV_test)
example = []
txtStrInput = sys.argv[1]
example += [txtStrInput]
result = model.predict(example)
print(""+result[0])
